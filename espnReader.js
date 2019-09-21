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
};

module.exports.getRosterForWeek = async (leagueId, season, teamId, week) => {
    const weekParamString = week ? `&scoringPeriodId=${week}` : "";
    const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?forTeamId=${teamId}&view=mRoster${weekParamString}`;
    const options = {
        method: 'GET',
        headers: {
            cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}`
        }
    };
    const res = await fetch(url, options);
    const json = await res.json();
    return json;
};

module.exports.getCurrentBoxscore = async (leagueId, season, teamId, week) => {
    // const weekParamString = week ? `&scoringPeriodId=${week}` : "";
    const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mBoxscore&view=mMatchupScore`
    const options = {
        method: 'GET',
        headers: {
            cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}`
        }
    };
    const res = await fetch(url, options);
    const json = await res.json();
    if (json.schedule && json.status){
        const currentWeekGames = json.schedule.filter(game => game.matchupPeriodId === json.status.currentMatchupPeriod);
        const matchupForTeam = currentWeekGames.find(game => game.home.teamId == teamId || game.away.teamId == teamId);
        return {
            team: json.teams.find(team => team.id == teamId),
            boxscore: matchupForTeam
        };
    } else {
        return json;
        // return {
        //     message: "no schedule data found"
        // }
    }
};