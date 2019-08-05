const { getLeagueOverview } = require('./espnReader');

const test = async () => {
    const data = await getLeagueOverview('286565');
    console.log(data);
    return data;
}

test();