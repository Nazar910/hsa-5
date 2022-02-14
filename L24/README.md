# Tasks
* create S3 bucket where objects can't be modified and all requests are logged

# Steps
* create S3 `test-bucket-b67fb58a-a753-441d-94a3-ef19577b3ab0` bucket with [WORM](https://aws.amazon.com/blogs/storage/protecting-data-with-amazon-s3-object-lock/) option enabled
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/create-bucket.png?raw=true)
* edit created bucket with default retention (I choosed 1 day)
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/object-lock-retention.png?raw=true)
* create new bucket `access-log-for-test-bucket-b67fb58a-a753-441d-94a3-ef19577b3ab0` for server access logs
* configure Server access logs
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/server-access-log-enabled.png?raw=true)

# Results

When we upload new file,
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/file-upload.png?raw=true)
we'll see:
* now it presents in our bucket;
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/bucket-files-list.png?raw=true)
* if you upload new file with same name it will not update current file but'll create new version:
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/versions.png?raw=true)
Also we can see all version along with actions with that objects:
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/versions-and-delete-markers.png?raw=true)
* we can see server-access logs our this insert;
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/access-log-files-list.png?raw=true)
* we can't delete current version of the file
![image](https://github.com/Nazar910/hsa-5/blob/main/L24/screenshots/delete-access-denied.png?raw=true)
