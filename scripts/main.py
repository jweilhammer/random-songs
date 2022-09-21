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
            total_tracks[id] = track
        print("TRACKS:", len(tracks))
        print("TOTAL UNIQUE TRACKS:", len(total_tracks))
        print("\n\n")


# Add spotify as a value in the json
# Output tracks as json arrays with category keys
for spotify_id, track in total_tracks.items():
    track["s"] = spotify_id

cleaned_output = {"Popular": [], "70s":[]}
for track in total_tracks.values():

    # Shorten key names to save space
    track["i"] = track["img"]
    track["n"] = track["name"]
    track["a"] = track["artist"]
    del track["img"], track["name"], track["artist"], track["popularity"]

    cleaned_output["70s"].append(track)

print(cleaned_output)
with open("songs.json", 'w') as fp:
    json.dump(cleaned_output, fp)