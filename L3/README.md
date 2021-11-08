# Goal
Create server-side worker that will be able to push data to Google analytics (so you could analyze this data along with data from your site).
In current implementation the data to be sent to GA is ua/usd currency rate fetch from NBU API.

# Prerequisites
* node and npm (you can check current lts version by https://nodejs.org/uk/)

# Install

```
    $ npm install
```

# Run
```
    GA_TRACKING_ID=UA-XXXXX npm start
```

## Required envs
* GA_TRACKING_ID - is tracking id of your property in Google analytics admin page

## Example output on start

```
> ga-currency-job@1.0.0 start
> node index.js

data to be sent to GA {"v":"1","tid":"UA-XXXXX","cid":"currency-fetch-job","cm1":26.0806,"t":"event","ec":"currencies","ea":"collect-rate","el":"ua/usd"}
Send
```
