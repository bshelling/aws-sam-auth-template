import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { addConfirmationStatus } from "../../../_utils/connection";


/**
 *  User interface
 */
 import { User } from '../../../_utils/models'

export const confirmationMsg = async function (email: String){

        const emailStatus = await addConfirmationStatus(
            email
        )
       
 
        return {
            status: emailStatus,
            sendEmail: new SendEmailCommand({
        Source: '',
        Message: {
            Body: {
              
                Text: {
                    Data: "confiramtion message"
                }
            },
            Subject: {
                Data: "Confirmation message"
            }
        },
        Destination: {
            ToAddresses: [email.toString()]
        }
    })
    }
}