'use strict';

const { getLeagueOverview } = require('./espnReader');

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.overview = async event => {
  // if seasonId was passed as param, use that. If not, set default
  const seasonId = event.queryStringParameters && event.queryStringParameters.season ? event.queryStringParameters.season : '2019'; // TODO: change to autodetected default season
  if (event.pathParameters){
    const data = await getLeagueOverview(event.pathParameters.id, seasonId);
    return {
      statusCode: 200,
      body: JSON.stringify(
        await data,
        null,
        2
      )
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: 'No path parameter for league ID found'
        }
      )
    };
  }
};
