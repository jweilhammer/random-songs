# Scripts
Here we are calling Spotify API, the main script is running all logic to pull and update songs

TODO: Completing youtube script for pre-compiling links, would need to setup cron jobs to run that are resilient to failure (commiting to github, or pushing progress to MongoDB/Dynamo)

# Setup

Install dependencies in virtual environment
```
python3 -m venv .env
source .env/bin/activate
pip install -r requirements.txt
```

# Updating Songs
To update songs for the dev environment, or for a prod build, run:
```
# Run this from frontend/
cd frontend/public/

# Define Spotify Secrets
export SPOTIFY_CLIENT_ID="client_id_here"
export SPOTIFY_CLIENT_SECRET="client_secret_here"

# Output songs in current dir
python ../../scripts/main.py
```