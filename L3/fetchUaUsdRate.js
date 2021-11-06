const axios = require('axios').default;
// url fetching only UA/USD rate
const NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange\?valcode\=USD\&json';

async function fetchUaUsdRate() {
    const { data } = await axios.get(NBU_URL);

    const rate = data[0].rate;

    return rate;
}

module.exports = {
    fetchUaUsdRate
}
