
import * as jwt from 'jsonwebtoken'

export default function setRole(role: String,secret: String){
    let signed

    switch(role){
        case "user":
            signed = jwt.sign({
                role: "user"
            },secret,{
                expiresIn: "1h"
            })
            
            break;
        case "admin":
            signed = jwt.sign({
                role: "admin"
            },secret,{
                expiresIn: "1h"
            })
            break; 
    }

    return signed

}

