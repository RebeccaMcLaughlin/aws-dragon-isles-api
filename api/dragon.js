const uuid = require("uuid");
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  try {
    const { name, species, image } = requestBody;
    const timestamp = new Date().getTime();

    const dragonInfo = {
      TableName: process.env.DRAGON_TABLE,
      Item: {
        id: uuid.v4(),
        name,
        species,
        image,
        submittedAt: timestamp,
        updatedAt: timestamp,
      },
    };

    const dragon = await dynamoDb
      .put(dragonInfo)
      .promise()
      .then((res) => {
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `New dragon species ${species} added.`,
            dragonId: dragonInfo.id,
          }),
        };
      });

      callback(null, dragon);
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to add dragon",
      }),
    });
  }
};

module.exports.list = async (event, context, callback) => {
  try {
    const dragons = await dynamoDb.scan({
      TableName: process.env.DRAGON_TABLE,
      AttributesToGet: ["id", "name", "species", "image"]
    })
    .promise();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        Items: dragons.Items
      })
    });
  } catch (err) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message
      })
    });
  }
};
