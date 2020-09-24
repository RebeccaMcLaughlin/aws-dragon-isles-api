
const AddCORS = (response, method = "GET") => {
  response.headers = {
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorize",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": method,
    "Access-Control-Allow-Credentials": true
  };

  return response;
};

module.exports = { AddCORS };