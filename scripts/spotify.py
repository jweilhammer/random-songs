import json
import base64
import requests
from requests.adapters import HTTPAdapter, Retry

class SpotifyAPI:

    def __init__(self, client_id, client_secret):
        # Start a re-usable HTTP session so we can configure backoffs and retries
        # Backoff retries like: time.sleep( {backoff factor} * (2 ** ({number of total retries} - 1)) )
        # Sleeping [0.05s, 0.1s, 0.2s, 0.4s, ...]
        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=0.1, status_forcelist=[418, 429, 500, 502, 503, 504])
        self.session.mount("https://", HTTPAdapter(max_retries=retries))

        # Auth re-used in future requests
        access_token = self.get_spotify_auth_token(client_id, client_secret)
        self.session.headers.update({'Authorization': f"Bearer {access_token}"})


    # Get access token to perform requests on spotify API
    def get_spotify_auth_token(self, client_id, client_secret):
        response = self.session.post(
            "https://accounts.spotify.com/api/token",
            headers={
                "Authorization": f"Basic {base64.b64encode((client_id+':'+client_secret).encode('ascii')).decode('ascii')}"
            },
            data={"grant_type": "client_credentials"},
        )

        return response.json().get("access_token")

    # Get list of all categories with their name and ID
    # { "hip-hop": "123", ... }
    def get_popular_categories(self):
        response = self.session.get(
            url="https://api.spotify.com/v1/browse/categories", timeout=10
        )

        print(response)

        data = response.json().get("categories").get("items")

        categories = {}
        for category in data:
            categories[category["name"]] = category["id"]

        return categories


    def get_playlists_for_category(self, category_id):
        response = self.session.get(
            url=f"https://api.spotify.com/v1/browse/categories/{category_id}/playlists",
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


    def get_tracks_in_playlist(self, playlist_id):
        response = self.session.get(
            url=f"https://api.spotify.com/v1/playlists/{playlist_id}",
            timeout=10,
        )

        tracks = {}
        data = response.json().get("tracks")
        tracks.update(self.extract_playlist_track_info(data["items"]))

        # Loop through all pages of the playlist's tracks
        while data["next"]:
            response = self.session.get(url=data["next"], timeout=10)

            data = response.json()
            tracks.update(self.extract_playlist_track_info(data["items"]))

        return tracks


    def extract_playlist_track_info(self, playlistItems):
        tracks = {}
        for item in playlistItems:

            # Need checks as some data returns as null from spotify
            if item:

                # Need checks as some data returns as null from spotify
                track = item["track"]
                if item["track"]:

                    # Get track name and create info dict for it
                    info = { "name": track["name"] }

                    # Get image for embeds [300x300]
                    for image in track["album"]["images"]:
                        if image["height"] == 300:
                            info["img"] = image["url"].replace("https://i.scdn.co/image/", "")

                    # Throw away tracks that don't have images
                    if not "img" in info:
                        continue

                    # Get comma separated list of artists
                    artists = []
                    for artist in track["artists"]:
                        artists.append(artist["name"])
                    info["artist"] = ", ".join(artists)

                    # Save popularity so we can filter out bad/dead songs
                    info["popularity"] = track["popularity"]

                    # Add track info for this playlist
                    tracks[track["id"]] = info

        return tracks

    def search_for_playlists(self, keyword):
        response = self.session.get(
            url=f"https://api.spotify.com/v1/search",
            timeout=10,
            params={
                "type": "playlist",
                "q": keyword,
                "limit": 10
            }
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