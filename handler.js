'use strict';

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
  if (event.pathParameters){
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Your league ID is: ${event.pathParameters.id}`
        },
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
