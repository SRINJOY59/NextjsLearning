import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


connect();


export async function POST(request: NextRequest) {
    try{
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        console.log(reqBody);

        //check if user already exists
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({error : "User does not exists"}, {status : 400});
        }
        if (!user.isVerfied) {
            throw new Error("Email not verified");
        }
        console.log("User exists");
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);
        //create token data
        const tokenData = {
            id : user.id, 
            password : user.password, 
            email : user.email
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : "1h"});
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
        })
        return response;
    }
    catch(error : any){
        return NextResponse.json({error : error.message}, {status : 500})
    }
}