'use strict';
const fetch = require('node-fetch');
const { ESPN_S2, ESPN_SWID} = require("./.env.json");


module.exports.getLeagueOverview = async (leagueId, season) => {
    console.log(leagueId);
    const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mMatchupScore&view=mPositionalRatings&view=mTeam`;
    const options = {
        method: 'GET',
        headers: {
            cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}`
        }
    };
    const res = await fetch(url, options);
    const json = await res.json();
    return json;
}