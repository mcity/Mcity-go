import os
import json
import string
import random
import boto3
from botocore.vendored import requests
from botocore.exceptions import ClientError
from url_validator import is_url
import logging

s3 = boto3.resource('s3')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    #Validate the token passed.
    header = event.get('headers', None)
    if not header:
        return create_error_message(403, 'No headers provided')       
    token = header.get('Authorization', None)
    if not token:
        return create_error_message(403, 'No auth token provided')    
    valid_token, message = validate_token(token, os.environ['SCOPE'])
    if not valid_token:
        return create_error_message(403, 'Token invalid for this scope')            
    
    #Validate the input
    input = get_input_object(event['body'])
    if not input:
        return create_error_message(422, 'Invalid url shortening request')
        
    #Generate a URL if one wasn't provided.
    if not input['custom']:
        input['custom'] = create_path()
        
    #Check if name exists
    result, message = is_url_free(input['custom'])
    if not result:
        return create_error_message(422, message)
    
    if not create_redirect(input['custom'], input['url']):
        return create_error_message(422, 'Redirect creation failed.')
    
    return {
        'statusCode': 200,
        'body': os.environ['DOMAIN'] + input['custom'],
        'headers': {'Access-Control-Allow-Origin': '*'}
    }
    
def is_url_free(path):
    """
    See if the S3 URL is free
    """
    try:
        s3.Object(os.environ['BUCKET'], path).load()
    except ClientError as e:
        if e.response['Error']['Code'] == "404":
            return True, 'File name free'
        else:
            return False, 'File name taken'
    return False, 'File name is taken'
    
def create_redirect(path, url):
    try:
        bucket = s3.Bucket(os.environ['BUCKET'])
        obj = bucket.Object(path)
        obj.put(ACL='public-read', WebsiteRedirectLocation=url)
    except:
        return False
    return True

def get_input_object(obj):
    """
    Validate the JSON and return an object with corrected url. 
    """
    new_obj = json.loads(obj)
    url = new_obj.get('url')
    if not is_url(url):
        return None
    custom = new_obj.get('custom', None)
    
    return {
        'url': url,
        'custom': custom
    }

def create_path():
    """
    Create a new random URL string
    """
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))

def save_redirect(path, url):
    """
    Put file on S3 and set redirect
    """
    redirect = {
        'Bucket': os.environ['BUCKET'],
        'Key': path,
        'WebsiteRedirectLocation': url
    }

def validate_token(auth_key, scope):
    """
    Validate a token is still valid.
    """
    req = mcity_keys_oauth(auth_key, 'token')
    if req.status_code == 200:
        try:
            json_data = req.json()
            if json_data['expiry'] > 0:
                # Check if token valid for requested scope.
                scopes = json_data['scope']
                if scope in scopes.split():
                    return True, "Found cors"
        except:
            return False, "Failed in status"

    return False, req.status_code
    
def mcity_keys_oauth(auth_key, endpoint):
    """
    Returns a request object for the token
    """
    headers = {
        'Authorization': auth_key,
        'X-MCITY-KEY': os.environ['OAUTH_PRESHARED'],
    }
    url = os.environ['OAUTH_HOST'] + endpoint
    request_result = requests.get(url, headers=headers)
    return request_result
    
def create_error_message(status_code, message):
    return {
      'statusCode': status_code,
      'body': message,
      'headers': {'Access-Control-Allow-Origin': '*.um.city'}
    }