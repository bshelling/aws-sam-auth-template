import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import { addUser } from "../../_utils/connection";
import setRole from "../../_utils/setRoles";
import { PKEY } from "../../_utils/variables";
import { confirmationMsg } from "./messages/confirmation";
import { notificationMsg} from './messages/confirmation-admin'

const secret = PKEY;

const client = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY,
  },
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const responseBody = JSON.stringify(event);
    const { email, username } = JSON.parse(event.body);
  

    const command = await confirmationMsg({
      email: email
    });



    const response = await client.send(command.sendEmail);

    const bodyRes = {
   
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers' : 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
    },
      body: JSON.stringify({
        message: "Confirmation Sent",
        status: command.status,
      }),
  }
  return bodyRes

  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};
