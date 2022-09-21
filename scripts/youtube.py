# NOTE: Gathering youtube links takes a long time due to timeouts/rate limiting on DuckDuckGo API
#       If using Youtube API, am limited to 100 searches a day.
#       Currently using AJAX calls to get this on the fly per song in the frontend instead
#       To have compiled links ahead of time with this, would need jobs that run for hours a day
#       In theory, after compiling a certain amount of songs the need for getting new youtube links would decrease over time

import json
import time
import random

# Seem to get less bad responses by switching our user agents to mimick different browsers
user_agents = {
    "chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36",
    "firefox": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:101.0) Gecko/20100101 Firefox/101.0",
    "safari": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A",
    "edge": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582",
    "ie": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
}

empty_youtube_tracks = []
def get_youtube_link(song_name, artist, request_session):

    retry = 0
    sleep_time = 0
    while (retry < 3):
        time.sleep(sleep_time)
        try:
            response = request_session.get(
                url=f"https://duckduckgo.com/?q=\\{song_name} {artist} site:youtube.com&format=json&no_redirect=1&t=testingthisout",
                headers={
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-US,en;q=0.6",
                    "cache-control": "max-age=0",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "sec-gpc": "1",
                    "upgrade-insecure-requests": "1",
                    "user-agent": random.choice(list(user_agents.values()))
                    
                },
                timeout=10,
            )
        except Exception as e:
            # Timeout exceptions, etc on request.  Sleep and retry
            print("Ran into exception:", e)
            time.sleep(2)
            continue


        # Handle random empty responses from server
        # TODO: Look into more, can't find anything online about it.. 200 but content is empty
        if len(response.content) < 20:
            retry += 1
            sleep_time = 3 * (2 ** (retry - 1))

            print("BAD retrying", retry, response, response.content)
            print(response.url)
            print("sleeping", sleep_time, "\n")
            continue

        link = response.json()["Redirect"]

        # Api couldn't give a youtube vid for this :-(
        if not link:
            print("BAD TRACK HERE", song_name, artist)
            return None
        
        response = request_session.get(
            url=link,
            timeout=10,
        )

        # Basic validation that this is indeed a good video:
        if song_name.split("(")[0] in response.text and artist.split(",")[0] in response.text:
            return link.replace("https://www.youtube.com/watch?v=", "")
        else:
            return None


def get_youtube_links_for_tracks(tracks, output):
    tracks_to_retry = []
    original_track_number = len(tracks)
    for id, track in tracks.items():
        print("Track:", track["name"], track["artist"])
        youtube_link = get_youtube_link(track["name"], track["artist"])
        if (youtube_link):
            track["youtube"] = youtube_link
            print(youtube_link, '\n\n')
            time.sleep(2)
        else:   
            print("Failed on track", tracks[id]["name"], "\n\n\n")
            tracks_to_retry.append(id)

    print("RETTRYING TRACKS", len(tracks_to_retry))
    for retry_id in tracks_to_retry:
        track = tracks[retry_id]
        print("Track:", track["name"], track["artist"])
        youtube_link = get_youtube_link(track["name"], track["artist"])

        if (youtube_link):
            track["youtube"] = youtube_link
            print("https://www.youtube.com/watch?v=" + youtube_link, '\n\n')
            time.sleep(2)
        else:
            del tracks[retry_id]

    # Add spotify as a value in the json
    # Output tracks as json arrays with category keys
    for key, value in tracks.items():
        value["s"] = key
        print(value)
    cleaned_output = {"Popular": []}
    for track in tracks.values():

        # Shorten key names to save space
        track["i"] = track["img"]
        track["n"] = track["name"]
        track["a"] = track["artist"]
        track["y"] = track["youtube"]
        del track["img"], track["name"], track["artist"], track["youtube"]

        cleaned_output["Popular"].append(track)

    print(cleaned_output)
    with open(f'{output}.json', 'w') as fp:
        json.dump(cleaned_output, fp)

    print("TOTAL TRACKS:", original_track_number, "SUCCESSES:", len(tracks), " = ", len(tracks)/original_track_number * 100, "%")
