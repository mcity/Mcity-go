# Mcity-go

Severless Oauth authenticated URL shortener running on AWS Lambda/S3. 
Vue frontend for creating redirect files in S3 bucket for authenticated users.

## Tech

Mcity-go uses a number of open source projects to work properly:

* [Vue.js] - Used for our dashboard front end.
* [Lambda] - Backend for updating S3 and verifying tokens.
* [S3] - Storage of redirect objects
* [Cloudfront] - Hosting https verisons of creation app.

Inspired by: https://github.com/danielireson/serverless-url-shortener

## Installation
### Setup S3
Setup S3 Bucket as public (read), and enable static website hosting.
Set base object to index.html

Upload a sample html file to index.html and make sure it's available at:
http://bucketname.regionname.amazonaws.com/

**Example:**
http://mcity-go.s3.us-east-2.amazonaws.com

Setup a sample redirect object. Upload a 0 length object to the bucket and on upload set the metadata


Set header-key on this file to Website-Redirect-Location with a value of where you'd like your redirect to go to.

Note that redirects only function when using the URL format below. If you do not use this format then S3 will send the 0 length object and not honor the redirect.
**Example:** http://mcity-go.s3-website.us-east-2.amazonaws.com/test

### Setup Cloundfront for HTTPS/Custom domain
Create a Cloudfront distribution
Set alternative domain names to your new domain (ex. go.um.city)
Set up an SSL certificate through ACM for this domain

For origin, use the bucket.s3-website.region.amazonaws.com format of your bucket.
Not using this will cause the redirect to not function.

### Deploy python services to Lambda
Upload both files to a function: lambda-function.py,url-validation.py

Add the following environment variables:
- BUCKET: The S3 Bucket.
- OAUTH_HOST: The host of the validation for token server
- OAUTH_PRESHARED: The preshared key for backend validation of your tokens
- DOMAIN: The domain prefix for redirection
- SCOPE: The cope of the auth token that is required

### Grant Bucket to IAM
When setting up your Lambda, it should have created a system IAM role that your lambda will execute as. Grant that role read/write access to objects in that bucket. PutObject, PutObjectACL, PutTag, ReadObject, ReadTag, ReadObjectACL, ListBucket, HeadBucket should do it.

### Setup API Gateway to Lambda services
Create POST gateway for API Lamda

Use the following model for input.
```
{
  "$schema" : "http://json-schema.org/draft-04/schema#",
  "title" : "URLSchema",
  "type" : "object",
  "properties" : {
    "url" : { 
        "type" : "string"
    },
    "custom" : { 
        "type" : "string", 
        "pattern": "[A-Za-z0-9]{20}"
    }
  }
}
```

Enable CORS for these endpoints

Since the API is setup for lambda proxy, the lambda itself also needs to return the CORS headers.

### Buld frontend website and deploy to S3 root.
Copy env_sample to .env and populate the VUE_APP values

```sh
$ npm run build
```

Copy files/folders from Dist folder to S3 bucket
Copy the APIDocs folder to the root of S3 Bucket
Invalidate cloudfront cache

### Testing backend services
You need to pass the following in the body to the API
```
"url": "http://google.com",
"custom": null
```

The headers must have a valid oauth token.
```
"Authentication": "Bearer JunkKeyHere"
```

### Development

This application is maintaineed by Tyler Worman (tworman@umich.edu) if you'd like to contribute, please create a pull request for features/fixes on this repository.