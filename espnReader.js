'use strict';
const fetch = require('node-fetch');
const { ESPN_S2, ESPN_SWID} = require("./.env.json");

const scheduleTeamHomeOrAway = (game, teamId) => {
    if (game.away.teamId === teamId){
        return "away";
    } else if (game.home.teamId === teamId){
        return "home";
    } else {
        return null;
    }
};

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
    const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mBoxscore&view=mMatchupScore`;
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
    }
};

module.exports.getStatsByPosition = async (leagueId, season, week) => {
    const weekParamString = week ? `&scoringPeriodId=${week}` : "";
    const url = `http://fantasy.espn.com/apis/v3/games/ffl/seasons/${season}/segments/0/leagues/${leagueId}?view=mBoxscore&view=mMatchupScore${weekParamString}`;
    const options = {
        method: 'GET',
        headers: {
            cookie: `espn_s2=${ESPN_S2}; SWID=${ESPN_SWID}`
        }
    };
    const res = await fetch(url, options);
    const json = await res.json();
    if (json.schedule){
        const selectedWeekGames = json.schedule.filter(game => game.matchupPeriodId === json.scoringPeriodId);
        const teamsWithGames = json.teams.map(team => {
            const teamSchedule = selectedWeekGames.filter(game => game.home.teamId === team.id || game.away.teamId === team.id);
            team.schedule = teamSchedule.map(game => {
                const roster = game[scheduleTeamHomeOrAway(game, team.id)].rosterForCurrentScoringPeriod;
                return {
                    week: game.matchupPeriodId,
                    roster: roster
                };
            });
            return team;
        });
        return teamsWithGames;
    } else {
        return json;
    }
}