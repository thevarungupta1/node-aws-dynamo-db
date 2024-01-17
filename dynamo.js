// import aws sdk
const AWS = require('aws-sdk')

// configure aws settings
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// create aws dynamodb document client
const DocumentClient = new AWS.DynamoDB.DocumentClient();

// get all items
const getAllItems = async (TABLE_NAME) => {
    const params = {
        TableName: TABLE_NAME
    }
    return await DocumentClient.scan(params).promise();
}


// get single item
const getSingleItemById = async (TABLE_NAME, id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id
        },
    }
    return await DocumentClient.get(params).promise();
}

// insert item
const insertItem = async (TABLE_NAME, itemObject) => {
    const params = {
        TableName: TABLE_NAME,
        Item: itemObject
    };
    return await DocumentClient.put(params).promise();
}


// generateUpdateQuery
const generateUpdateQuery = (fields) => {
    let exp = {
        UpdateExpression: 'set',
        ExpressionAttributeNames: {},
        ExpressionAttributeValues: {}
    };
    Object.entries(fields).forEach(([key, item]) => {
        exp.UpdateExpression += `#${key} = :${key}, `;
        exp.ExpressionAttributeNames[`#${key}`] = key;
        exp.ExpressionAttributeValues[`:${key}`] = item
    });
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return exp;
}

// update item
const updateItem = async (TABLE_NAME, id, itemObject) => {
    const expression = generateUpdateQuery(itemObject);
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
        ConditionExpression: 'attribute_exists(id)',
        ...expression,
        ReturnValues: 'UPDATED_NEW'
    };
    return await DocumentClient.update(params).promise();
}

// delete item
const deleteSingleItemById = async (TABLE_NAME, id) => {
    const params = {
        TableName: TABLE_NAME,
        Key:{
            id
        }
    }
    return await DocumentClient.delete(params).promise();
}

module.exports = {
    DocumentClient,
    getAllItems,
    getSingleItemById,
    insertItem,
    updateItem,
    deleteSingleItemById
}




