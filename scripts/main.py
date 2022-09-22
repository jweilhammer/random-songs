import os
import json
from spotify import SpotifyAPI

# Get playlists by searching on keyword
# Used for gettting decade lists at the moment
def add_playlists_from_extra_categories(spotify_api, extra_categories, total_playlists):
    for category in extra_categories:
        playlists = spotify_api.search_for_playlists(category)
        total_playlists[category] = playlists

        # Avoid decades grouped together
        playlists_to_delete = []
        for playlist in playlists:
            if (("70" in playlist or "1970" in playlist) and category != "70s"):
                playlists_to_delete.append(playlist)

            if (("80" in playlist or "1980" in playlist) and category != "80s"):
                playlists_to_delete.append(playlist)
            
            if (("90" in playlist or "1990" in playlist) and category != "90s"):
                playlists_to_delete.append(playlist)
            
            if ("2000" in playlist and category != "2000s"):
                playlists_to_delete.append(playlist)
            
            if ("2010" in playlist and category != "2010s"):
                playlists_to_delete.append(playlist)
            
        for playlist in playlists_to_delete:
            print(category, "DELETING PLAYLIST", playlist,)
            del playlists[playlist]


# Get default popular categories from Spotify, filter out some ones that are too similar
def add_playlists_from_popular_categories(spotify_api, total_playlists):
    
    # Dont use some categories because they're too similar to others (i.e. "Regional Mexican" vs "Latin")
    for category in popular_categories:
        if any(x in category.lower() for x in ["mexican", "summer", "workout", "equal", "chill", "mood"]):
            print("SKIPPING CATEGORY", category)
            continue

        playlists = spotify_api.get_playlists_for_category(popular_categories[category])
        total_playlists[category] = playlists

        # Remove playlists that drown out the popular vibe
        if category == "Top Lists":
            exclude = ["global", "latin", "new", "mint", "rap", "are", "country", "rock"]
            for badPlaylist in [name for name in playlists if any(x in name.lower() for x in exclude)]:
                print(category, "DELETING PLAYLIST", badPlaylist)
                del playlists[badPlaylist]
            
            # Rename "Top Lists" to "Popular" instead
            total_playlists["Popular"] = total_playlists.pop("Top Lists")


        # Remove playlists that make some categories bad/too similar to other categories
        if (category == "Gaming"):
            exclude = ["hip", "pop", "top", "power", "indie", "trophy", "rock", "country"]
            for badPlaylist in [name for name in playlists if any(x in name.lower() for x in exclude)]:
                print(category, "DELETING PLAYLIST", badPlaylist)
                del playlists[badPlaylist]


# Return all the category tracks from their playlists => { "Popular": { trackId1: {}, trackId2: {} } }
def get_tracks_from_playlists(spotify_api, category_playlists):
    category_tracks = {}
    for category, playlists in category_playlists.items():
        print("CATEGORY", category)

        # Create new dictionary for the category to prevent duplicate songs
        if not category in category_tracks:
            category_tracks[category] = {}
        
        for playlistName, playlist in playlists.items():

            print("PLAYLIST", playlistName)
            tracks = spotify_api.get_tracks_in_playlist(playlist["id"])
            for id, track in tracks.items():
                track["id"] = id
                track["category"] = category
                category_tracks[category][id] = track

            print("TRACKS:", len(tracks))
            print("TOTAL TRACKS IN CATEGORY", len(category_tracks[category]))
            print("\n")
    
    return category_tracks


# Main logic for ouputting spotify generated categories and tracks
if __name__=="__main__":

    # Initialize Spotify API wrapper with our client secret
    client_id = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
    spotify_api = SpotifyAPI(client_id, client_secret)

    # Get default popular categories from spotify, and our own (decade lists for now)
    popular_categories = spotify_api.get_popular_categories()
    extra_categories = [
        "70s",
        "80s",
        "90s",
        "2000s",
        "2010s",
    ]

    # Get all playlists for categories
    category_playlists = {}
    add_playlists_from_extra_categories(spotify_api, extra_categories, category_playlists)
    add_playlists_from_popular_categories(spotify_api, category_playlists)

    # Get all tracks for each category in dict to prevent duplicates
    category_tracks = get_tracks_from_playlists(spotify_api, category_playlists)
    
    # Output songs to their own array per category { "Popular" : [...] }
    output = {}
    for category, tracks in category_tracks.items():
        if not category in output:
            output[category] = []

        # Use array for easier mapping by the UI
        # Tracks are already in dict to prevent duplicates
        for id, track in tracks.items():
            output[category].append(track)

        print("TOTAL CATEGORY TRACKS", category, len(tracks))

    # Final cleanup on output
    categories_to_delete = []
    for category in output:

        # Mark categories that are empty or don't have enough songs
        if len(output[category]) < 40:
            categories_to_delete.append(category)
            continue

        # Filter total songs in each category to the top 500
        output[category].sort(key=lambda track: track["popularity"], reverse=True)
        output[category] = output[category][:500]

        # Shorten attribute names to save space
        for track in output[category]:
            track["s"] = track.pop("id")
            track["i"] = track.pop("img")
            track["n"] = track.pop("name")
            track["a"] = track.pop("artist")
            del track["category"], track["popularity"]

    # Remove empty categories
    for bad_category in categories_to_delete:
        print("CATEGORY", bad_category, "DID NOT HAVE ENOUGH SONGS, REMOVING")
        del output[bad_category]

    # Should always have popular songs as an option
    if not "Popular" in output:
        raise Exception("Popular songs not included!")

    with open("songs.json", 'w') as fp:
        json.dump(output, fp, separators=(',', ':'))