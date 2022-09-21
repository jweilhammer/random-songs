import os
from spotify import SpotifyAPI

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

total_tracks = {}
total_playlists = {}
for category in extra_categories:
    playlists = spotify.search_for_playlists(category)
    total_playlists[category] = playlists


# for category in popular_categories:
#     playlists = spotify.get_playlists_for_category(popular_categories[category])
#     total_playlists[category] = playlists


for category, playlists in total_playlists.items():
    print(category)

    for playlistName, playlist in playlists.items():
        print(playlist)
        tracks = spotify.get_tracks_in_playlist(playlist["id"])
        for id, track in tracks.items():
            track["id"] = id
            total_tracks[id] = track
        print("UNIQUE TRACKS:", len(total_tracks))
        print("\n\n")