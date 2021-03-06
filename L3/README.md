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

## Example data we can see in GA:
### Behaviour -> Events -> Overview
![image](https://user-images.githubusercontent.com/19594637/140818979-628d7b81-3628-428a-b87e-260679a79e0d.png)

### Customer reports (you can use your custom metrics here)
![image](https://user-images.githubusercontent.com/19594637/140818656-3cf75c59-75f7-4e35-9d4e-1f91b59e11a4.png)
