'use strict';

const { 
  getLeagueOverview, 
  getRosterForWeek,
  getCurrentBoxscore,
  getStatsByPosition
 } = require('./espnReader');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports.ping = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Fantasy data is live baby!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.overview = async event => {
  // if seasonId was passed as param, use that. If not, set default
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019'; // TODO: change to autodetected default season
  if (event.pathParameters){
    const data = await getLeagueOverview(event.pathParameters.id, seasonId);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(
        await data,
        null,
        2
      )
    };
  } else {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify(
        {
          message: 'No path parameter for league ID found'
        }
      )
    };
  }
};

module.exports.weeklyRosters = async event => {
  // TODO: implement roster retrieval
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019'; // TODO: change to autodetected default season
  const leagueId = event.pathParameters.id;
  const teamId = event.pathParameters.teamId;
  const week = event.queryStringParameters ? event.queryStringParameters.week : null;
  // make request using params generated above
  const data = await getRosterForWeek(leagueId, seasonId, teamId, week);
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

module.exports.currentMatchup = async event => {
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019';
  const leagueId = event.pathParameters.id;
  const teamId = event.pathParameters.teamId;
  const week = event.queryStringParameters ? event.queryStringParameters.week : null;
  // make request using params generated above
  const data = await getCurrentBoxscore(leagueId, seasonId, teamId, week);
  return {
    statusCode: 200,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
}

module.exports.positionStats = async event => {
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019';
  const leagueId = event.pathParameters.id;
  const week = event.queryStringParameters ? event.queryStringParameters.week : null;
  const data = await getStatsByPosition(leagueId, seasonId, week);
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
};

module.exports.seasonSummary = async event => {
  // check for season param or set default
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019';
  const leagueId = event.pathParameters.id;
  // fetch data for current week
  let data = await getStatsByPosition(leagueId, seasonId, null);
  const currWeek = await (data[0].schedule[0].week * 1);
  const weeks = [...Array(currWeek).keys()].filter(num => num !== 0);
  const getAllWeeks = async () => {
    return Promise.all(weeks.map(week => getStatsByPosition(leagueId, seasonId, week)));
  }
  // retrieve array of all weeks data
  const allWeeksData = await getAllWeeks();
  // map over original current week array of teams and add all weeks to schedule property
  const compiledData = data.map(team => {
    allWeeksData.forEach(weekTeams => {
      const currTeamWeek = weekTeams.find(tm => tm.id === team.id);
      // add the week obj from the schedule array to the master data obj
      team.schedule.push(currTeamWeek.schedule[0]);
    });
    team.schedule.sort((a,b) => a.week - b.week);
    return team;
  });
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(
      compiledData,
      null,
      2
    ),
  };
};
