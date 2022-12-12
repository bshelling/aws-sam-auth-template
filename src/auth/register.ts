import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { addUser } from '../../_utils/connection';
import setRole from '../../_utils/setRoles';

import { PKEY } from '../../_utils/variables'

const secret = PKEY

/**
 * 
 * API Response - Returns a jwt token when user signs up successfully
 * 
 * @param event 
 * @param context 
 * @returns 
 */


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

try {
    
    const responseBody = JSON.stringify(event)
    const {role,firstName, lastName, password, email} = JSON.parse(event.body)
    const roleToken = setRole(role,secret)

   
    if(!roleToken){
        return {
            statusCode: 403,
            body: JSON.stringify({
                message: "Something went wrong"
            })
        }; 
    }

    const itemRes = await addUser({
        firstName: firstName ? firstName : "",
        lastName: lastName ? lastName : "",
        email: email ? email : "",
        password: password ? password : ""
    })

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