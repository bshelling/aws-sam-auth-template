import { APIGatewayEvent } from 'aws-lambda';

/**
 * 
 *  Extracts the 'Bearer=' from the token string
 * 
 * @param event 
 * @returns 
 */

export default function getToken(event: APIGatewayEvent ):String {

    const token:any = event.headers.Authorization?.split("Bearer=") || event.headers.Authorization?.split(" ")
    return token[1]

}