import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

import {createTable} from '../../_utils/connection';


/**
 * 
 *  Root 
 *  Path: /
 * 
 * @param event 
 * @param context 
 * @returns Response 
 */
export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    if(event.httpMethod !== 'POST'){
       
        const tableRes = await createTable()
        return {
            statusCode: 200,
            body: JSON.stringify({
                // message: 'hello world',
                // eventObj: event,
                tableStatus: "Table created",
                response: tableRes
            }),
            headers: {
                "Content-Type":"application/json"
            }
        };
    }

};