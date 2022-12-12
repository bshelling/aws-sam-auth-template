import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken'
import { addUser } from '../../_utils/connection';
import getToken from '../../_utils/getToken';
import { PKEY } from '../../_utils/variables'

const secret = PKEY

/**
 * API response based on the role - user or admin 
 * 
 * @param event 
 * @param context 
 * @returns APIGatewayProxyResult 
 */


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

try {

    const signed = jwt.verify(getToken(event),secret)
    
    if(signed.role == "admin"){
        return {
            statusCode: 200,
            body: JSON.stringify({
                role: signed.role
            })
        }
    }

    if(signed.role == "user"){
        return {
            statusCode: 200,
            body: JSON.stringify({
                role: signed.role,
            })
        }
    }
      
}
catch(err){
    return {
        statusCode: 403,
        body: JSON.stringify({
            message: err,
            eventMsg: event
        })
    }
}

};