import { util } from "@aws-appsync/utils";

/**
 * Updates an item in a DynamoDB table, if an item with the given key exists.
 * @param {import('@aws-appsync/utils').Context<{input: any}>} ctx the context
 * @returns {import('@aws-appsync/utils').DynamoDBUpdateItemRequest} the request
 */
export function request(ctx) {
  const { battery, ...values } = ctx.args.input;

  const key = { battery };
  const condition = {};
  for (const k in key) {
    condition[k] = { attributeExists: true };
  }
  return dynamodbUpdateRequest({ key, values, condition });
}

/**
 * Returns the updated item or throws an error if the operation failed.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return result;
}

/**
 * Builds an update request
 * @param {Object} params values to publish
 * @param {Object.<string, unknown>} params.key the request key
 * @param {*} params.values the request values
 * @param {*} [params.condition] the request condition
 * @returns {*} the request
 */
function dynamodbUpdateRequest(params) {
  const { key, values, condition: inCondObj } = params;

  const sets = [];
  const removes = [];
  const expressionNames = {};
  const expValues = {};

  // Iterate through the keys of the values
  for (const key in values) {
    // Save the name
    expressionNames[`#${key}`] = key;
    const value = values[key];
    if (value) {
      // If there is a value, add it to list to be updated
      sets.push(`#${key} = :${key}`);
      expValues[`:${key}`] = value;
    } else {
      // If the value is null, add it to the list to be removed
      removes.push(`#${key}`);
    }
  }

  let expression = "";
  expression += sets.length ? `SET ${sets.join(", ")}` : "";
  expression += removes.length ? ` REMOVE ${removes.join(", ")}` : "";

  let condition;
  if (inCondObj) {
    condition = JSON.parse(
      util.transform.toDynamoDBConditionExpression(inCondObj)
    );
    if (
      condition &&
      condition.expressionValues &&
      !Object.keys(condition.expressionValues).length
    ) {
      delete condition.expressionValues;
    }
  }
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues(key),
    condition,
    update: {
      expression,
      expressionNames,
      expressionValues: util.dynamodb.toMapValues(expValues),
    },
  };
}
