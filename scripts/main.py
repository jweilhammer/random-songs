import os
from spotify import SpotifyAPI

client_id = os.environ["SPOTIFY_CLIENT_ID"]
client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]

spotify = SpotifyAPI(client_id, client_secret)

# Get all tracks from all top categories
categories = spotify.get_popular_categories()
print(categories)
total_tracks = {}
for cat in categories:
    print("CATEGORY:", cat, "\n\n")
    playlists = spotify.get_playlists_for_category(categories[cat])
    for playlistName in playlists:
        print(playlistName)
        tracks = spotify.get_tracks_in_playlist(playlists[playlistName]["id"])
        for id, track in tracks.items():
            track["id"] = id
            total_tracks[id] = track

    print("UNIQUE TRACKS:", len(total_tracks))
    print("\n\n\n\n\n")
    