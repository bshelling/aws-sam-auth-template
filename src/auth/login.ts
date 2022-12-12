import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { addUser, getUser } from '../../_utils/connection';
import setRole from '../../_utils/setRoles';
import { PKEY } from '../../_utils/variables'

const secret = PKEY


/**
 * 
 * API response - Returns a user jwt when successfully logged 
 * 
 * @param event 
 * @param context 
 * @returns APIGatewayProxyResult
 */

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

try {
    
    const responseBody = JSON.stringify(event)
    const {password, username} = JSON.parse(event.body)

  
    const {role} = await getUser({
        password: password,
        email: username
    }) 
    const roleToken = setRole(role,secret)

    if(!roleToken){
        return {
            statusCode: 403,
            body: JSON.stringify({
                message: "Something went wrong"
            })
        }; 
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            token: roleToken,
        })
    };
}
catch(err){

    return {
        statusCode: 403,
        body: JSON.stringify({
            message: err
        })
    }


}


    
};