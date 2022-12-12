import * as AWS from 'aws-sdk'

import { DynamoDBClient, CreateTableCommand, PutItemCommand, GetItemCommand, QueryCommand, UpdateItemCommand, ReturnValue} from '@aws-sdk/client-dynamodb'
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { PKEY, TABLENAME } from '../_utils/variables'

/**
 *  User interface
 */
import { User } from './models'

/**
 *  Dynamodb configuration
 */
const client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://192.168.1.103:8000/',
    credentials: {
        accessKeyId: 'accessId',
        secretAccessKey: 'secret'
    }
})

/**
 * 
 *  Create Dynamodb Table
 * 
 */
export async function createTable(){


    const params = {
        AttributeDefinitions:[
            {
                AttributeName: 'ROLE',
                AttributeType: 'S'
            },
            {
                AttributeName: 'USERNAME',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            
            {
                AttributeName: 'USERNAME',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'ROLE',
                KeyType: 'RANGE'
            }
        ],
        TableName: TABLENAME,
        TableClass: 'STANDARD',
        BillingMode: 'PAY_PER_REQUEST',
        StreamSpecification: {
            StreamEnabled: false
        }
    }


    try{
        console.log("=========== Table Creation=======")
     
    
        const res = await client.send(new CreateTableCommand(params))
        
        console.log("======================")
    }
    catch(err){
        console.log(err)
    }

  

}

/**
 * 
 * Get Table Item
 * 
 * @param user 
 * @returns User's Role
 */
export async function getUser(user: User){

    try {
    
        const data = await client.send(new QueryCommand({
            TableName: TABLENAME,
            KeyConditionExpression: "USERNAME = :s",
            ExpressionAttributeValues: {
                ":s": { 
                    S: user.email.toString() 
                }
            }
        }))
           
        const password = data.Items[0].password.S
        const salt = data.Items[0].salt.S
        
        const hash = pbkdf2Sync(user.password.toString(),salt,1000,64,'sha512').toString('hex')

        if(hash == password){
            return {
                role: data.Items[0].ROLE.S
            }
        }

    }
    catch(err){
        console.log(err)
    }
}

/**
 *  Add User to table
 * @param user 
 */
export async function addUser(user: User){

    const salt = randomBytes(16).toString('hex')
    const hash = pbkdf2Sync(user.password.toString(),salt,1000,64,'sha512').toString('hex')

    try{

        const data = await client.send(new PutItemCommand({
            TableName: TABLENAME,
            Item:{
                "USERNAME": {"S":user.userEmail.toString()},
                "firstName": {"S":user.firstName.toString()},
                "lastName": {"S":user.lastName.toString()},
                "password":{"S": hash},
                "salt": {"S":salt.toString()},
                "ROLE": {"S":"admin"}
            }
        }))
        return data

    }
    catch(err){
        return err
    }
}


export async function addConfirmationStatus(email: String){

    try{

        const data = await client.send(new UpdateItemCommand({
            TableName: TABLENAME,
            Key:{
                USERNAME: {
                    "S": email.toString()
                },
                ROLE: {
                    "S": "admin"
                }
            },
            UpdateExpression: 'set #confEmail = :v_confEmail, #confEmailSent = :v_confEmailSent',
            ExpressionAttributeNames: {
                "#confEmail":"ConfEmail",
                "#confEmailSent":"ConfEmailSent"
            },
            ExpressionAttributeValues: {
                ":v_confEmail": {
                    "S": "Yes"
                },
                ":v_confEmailSent": {
                    "S": Date.now().toString()
                },
            },
            ReturnValues: "UPDATED_NEW"
        }))

 
        console.log(`${data}`)

        return {
            msg: "updated"
        }
    }
    catch(err){
 
        return {
            msg: "something"
        }
    }
}