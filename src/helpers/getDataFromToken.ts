import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { request } from "http";

export const getTokenData =  (request : NextRequest) => {
    try{
        const token = request.cookies.get("token")?.value || '';
        if(!token){
            throw new Error('Token not found');
        }
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        return decodedToken.id;
    }
    catch(error : any){
        throw new Error(error.message);
    }
}