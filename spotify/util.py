from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import socket
from time import sleep


BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)

    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    """Updates or creates user tokens required to access the Spotify of he host"""
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(session_id):
    """Check if spotify is authenticated"""
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            """if tokens have expired refresh the tokens"""
            refresh_spotify_token(session_id)

        return True

    return False


def refresh_spotify_token(session_id):
    """Refresh tokens once expired"""
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    """Executes any request made to the spotify APIs endpoints"""
    tokens = get_user_tokens(session_id)
    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}

    if post_ == True:
        response = post(BASE_URL + endpoint, headers=headers)
        print(response.status_code)
        print(response.content)
        try:
            return response.json()
        except:
            return {'Error': 'Issue with request'}

    if put_ == True:
        response = put(BASE_URL + endpoint, headers=headers)
        print(response.status_code)
        print(response.content)
        try:
            return response.json()
        except:
            return {'Error': 'Issue with request'}

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}


def play_song(session_id):
    """Enables users to have play functionalities"""
    return execute_spotify_api_request(session_id, "player/play", put_=True)


def pause_song(session_id):
    """Enables users to have pause functionalities"""
    return execute_spotify_api_request(session_id, "player/pause", put_=True)


def skip_song(session_id):
    """Enables users to have skip functionalities"""
    try:
        response = execute_spotify_api_request(
            session_id, "player/next", post_=True)
    except socket.error as e:
        print(f"Socket error: {e}. Reconnecting to client...")
        sleep(2)  # wait for a bit before attempting to reconnect
        # call the function recursively to retry the API request
        skip_song(session_id)

    return response
