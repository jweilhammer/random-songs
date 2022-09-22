import os
from spotify import SpotifyAPI
import json

client_id = os.environ["SPOTIFY_CLIENT_ID"]
client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]

spotify = SpotifyAPI(client_id, client_secret)

# Get all tracks from all top categories
popular_categories = spotify.get_popular_categories()


# Define extra categories to get playlists for
extra_categories = [
    "70s",
    "80s",
    "90s",
    "2000s",
    "2010s",
]

total_playlists = {}
for category in extra_categories:
    playlists = spotify.search_for_playlists(category)
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


for category in popular_categories:
    # Dont use some categories because they're too similar to others (i.e. "Regional Mexican" vs "Latin")
    if any(x in category.lower() for x in ["mexican", "summer", "workout", "equal", "chill"]):
        print("SKIPPING CATEGORY", category)
        continue

    playlists = spotify.get_playlists_for_category(popular_categories[category])
    total_playlists[category] = playlists

    # Remove playlists that drown out the popular vibe
    if category == "Top Lists":
        exclude = ["global", "latin", "new", "mint", "rap", "are", "country", "rock"]
        for badPlaylist in [name for name in playlists if any(x in name.lower() for x in exclude)]:
            print(category, "DELETING PLAYLIST", badPlaylist)
            del playlists[badPlaylist]
        
        # Rename "Top Lists" to "Popular" instead
        total_playlists["Popular"] = total_playlists["Top Lists"]
        del total_playlists["Top Lists"]


    # Remove playlists that make some categories bad/too similar to other categories
    if (category == "Gaming"):
        exclude = ["hip", "pop", "top", "power", "indie", "trophy", "rock", "country"]
        for badPlaylist in [name for name in playlists if any(x in name.lower() for x in exclude)]:
            print(category, "DELETING PLAYLIST", badPlaylist)
            del playlists[badPlaylist]
    

output = {
    "Popular": [],
    "Pop": [],
    "Hip-Hop": [],
    "R&B": [],
    "Rock": [],
    "70s": [],
    "80s": [],
    "90s": [],
    "2000s": [],
    "2010s": [],
}
for category, playlists in total_playlists.items():

    print("CATEGORY", category)
    
    for playlistName, playlist in playlists.items():

        print("PLAYLIST", playlistName)
        
        tracks = spotify.get_tracks_in_playlist(playlist["id"])

        print("TRACKS:", len(tracks))
        print("\n")

        for id, track in tracks.items():
            track["s"] = id
            track["category"] = category
            if category in output:
                output[category].append(track)
            else:
                output[category] = [track]
        

        

# Get top 500 most popular songs of category
categories_to_delete = []
for category, tracks in output.items():
    if len(tracks) < 40:
        categories_to_delete.append(category)
        continue

    print(category)
    
    # UI doesn't need popularity, delete
    for track in tracks:
        # Shorten attribute names to save space
        track["i"] = track["img"]
        track["n"] = track["name"]
        track["a"] = track["artist"]
        del track["img"], track["name"], track["artist"],
        del track["popularity"]


    print("TOTAL TRACKS", len(tracks))
    output[category] = tracks

for bad_category in categories_to_delete:
    print("CATEGORY", bad_category, "DID NOT HAVE ENOUGH SONGS, REMOVING")
    del output[bad_category]

with open("songs.json", 'w') as fp:
    json.dump(output, fp)