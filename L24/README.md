# Tasks
* create S3 bucket where objects can't be modified and all requests are logged

# Steps
* create S3 `test-bucket-b67fb58a-a753-441d-94a3-ef19577b3ab0` bucket with [WORM](https://aws.amazon.com/blogs/storage/protecting-data-with-amazon-s3-object-lock/) option enabled
* edit created bucket with default retention (I choosed 1 day)
* create new bucket `server-access-log-for-test-bucket-b67fb58a-a753-441d-94a3-ef19577b3ab0` for server access logs
* configure Server access logs

# Results

When we upload new file, we'll see:
* now it presents in our bucket;
* we can see server-access logs our this insert;
* we can't delete or update current version of the file
