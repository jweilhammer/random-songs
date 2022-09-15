import os
import base64
import requests
from requests.adapters import HTTPAdapter, Retry

client_id = os.environ["SPOTIFY_CLIENT_ID"]
client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]

# Get access token to perform requests on spotify API
def get_spotify_auth_token():
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={
            "Authorization": f"Basic {base64.b64encode((client_id+':'+client_secret).encode('ascii')).decode('ascii')}"
        },
        data={"grant_type": "client_credentials"},
    )

    print(response)
    print(response.json().get("access_token"))

    return response.json().get("access_token")


# Get list of all categories with their name and ID
# { "hip-hop": "123", ... }
def get_categories():
    response = session.get(
        url="https://api.spotify.com/v1/browse/categories", headers=headers, timeout=10
    )

    data = response.json().get("categories").get("items")

    categories = {}
    for category in data:
        categories[category["name"]] = category["id"]

    return categories


def get_playlists_for_category(category_id):
    response = session.get(
        url=f"https://api.spotify.com/v1/browse/categories/{category_id}/playlists",
        headers=headers,
        timeout=10,
    )

    data = response.json().get("playlists").get("items")

    playlists = {}
    for playlist in data:
        if playlist:
            playlists[playlist["name"]] = {
                "id": playlist["id"],
                "description": playlist["description"],
            }

    return playlists


def get_tracks_in_playlist(playlist_id):
    response = session.get(
        url=f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers=headers,
        timeout=10,
    )

    tracks = {}
    data = response.json().get("tracks")
    tracks.update(extract_playlist_track_info(data["items"]))

    # Loop through all pages of the playlist's tracks
    while data["next"]:
        response = session.get(url=data["next"], headers=headers, timeout=10)

        data = response.json()
        tracks.update(extract_playlist_track_info(data["items"]))

    return tracks


def extract_playlist_track_info(playlistItems):
    tracks = {}
    for item in playlistItems:

        # Need checks as some data returns as null from spotify
        if item:

            # Need checks as some data returns as null from spotify
            track = item["track"]
            if item["track"]:

                # Get track name and create info dict for it
                info = {
                    "name": track["name"],
                }

                # Get image for embeds [300x300]
                # Add else in case the 2nd image isn't [300x300] for any reason
                for image in track["album"]["images"]:
                    if image["height"] == 300:
                        info["img"] = image["url"]

                # Throw away tracks that don't have images
                if not "img" in info:
                    continue

                # Get comma separated list of artists
                artists = []
                for artist in track["artists"]:
                    artists.append(artist["name"])
                info["artist"] = ", ".join(artists)

                # Store into our tracks dict with ID as the key
                tracks[track["id"]] = info

    return tracks


# Start a re-usable HTTP session so we can configure backoffs and retries
# Backoff retries like: time.sleep( {backoff factor} * (2 ** ({number of total retries} - 1)) )
# Sleeping [0.05s, 0.1s, 0.2s, 0.4s, ...]
session = requests.Session()
retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[429, 500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retries))

# Auth re-used in future requests
access_token = get_spotify_auth_token()
headers = {"Authorization": f"Bearer {access_token}"}

# Get all tracks from all top categories
categories = get_categories()
for cat in categories:
    print("CATEGORY:", cat, "\n\n")
    playlists = get_playlists_for_category(categories[cat])
    for playlistName in playlists:
        print(playlistName)
        print(playlists[playlistName])

        print("GETTING", playlists[playlistName]["id"])
        tracks = get_tracks_in_playlist(playlists[playlistName]["id"])
        print(tracks)
        print(len(tracks))

    print("\n\n\n\n\n")