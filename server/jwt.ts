import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const TOKEN_EXPIRY = "5m"; 
const COOKIE_EXPIRY = "7d";


export const generateLinkToken = async (email : string) => {
    const res = await jwt.sign(email , JWT_SECRET , { expiresIn:TOKEN_EXPIRY });
    return res
}
export const generateSessionCookie = async(email : string) => {
    const res = await jwt.sign(email , JWT_SECRET , { expiresIn : COOKIE_EXPIRY })
    return res;
}

export const verifyToken = async(email:string) => {
    try {
        const res = jwt.verify(email , JWT_SECRET) as {email : string}
        return res.email
    } catch(err) {
        console.log("Error during Token Verification"+err);
        
    }
}
