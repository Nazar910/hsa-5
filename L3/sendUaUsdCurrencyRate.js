const axios = require('axios').default;
// use this GA_COLLECT_URL to validate your hit first
// const GA_COLLECT_URL = 'https://www.google-analytics.com/debug/collect';
const GA_COLLECT_URL = 'https://www.google-analytics.com/collect';
const { GA_TRACKING_ID } = process.env;

const trackEvent = (category, action, label, value) => {
    const data = {
        // API Version.
        v: '1',
        // Tracking ID / Property ID.
        tid: GA_TRACKING_ID,
        // client id
        cid: 'currency-fetch-job',

        cm1: value,
        // Event hit type.
        t: 'event',
        // Event category.
        ec: category,
        // Event action.
        ea: action,
        // Event label.
        el: label,

        // // page view example
        // v: '1',
        // tid: GA_TRACKING_ID,
        // cid: 'currency-fetch-job',
        // cm1: value,
        // t: 'pageview',
        // dp: '/currency-fetch',
        // pr1pr: value
    };

    console.log('data', JSON.stringify(data));

    return axios.get(GA_COLLECT_URL, {
        params: data,
        headers: {
            'User-Agent': 'my-integration/1.2.3'
        }
    });
};

async function sendUaUsdCurrencyRate(rate) {
    const result = await trackEvent('currencies', 'collect-rate', 'ua/usd', rate);
    // uncomment following lines when you wan't to check debug info when using debug url
    // console.log('result.data', result.data);
    // console.log('result.data', result.data.hitParsingResult[0]);
}

module.exports = {
    sendUaUsdCurrencyRate
}