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
    body: JSON.stringify(
      data,
      null,
      2
    ),
  };
}