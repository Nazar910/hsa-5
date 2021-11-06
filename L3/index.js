const { fetchUaUsdRate } = require('./fetchUaUsdRate');
const { sendUaUsdCurrencyRate } = require('./sendUaUsdCurrencyRate');

async function main() {
    const rate = await fetchUaUsdRate();
    await sendUaUsdCurrencyRate(rate);
}

if (require.main === module) {
    // in case script is called from command line
    main().then(() => console.log('Send'));
}
