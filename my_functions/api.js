exports.handler = async (event, context) => {
  console.log('api: it is running...');
  console.log(event);
  console.log(context);
  return {
    statusCode: 200,
    body: JSON.stringify({
      api: process.env.SEARCH_API_KEY,
    }),
  };
};
