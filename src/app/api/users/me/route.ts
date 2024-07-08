import { getTokenData } from "@/helpers/getDataFromToken";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request : NextRequest){
    try{
        const userId = await getTokenData(request);
        const user = await User.findOne({_id: userId}).select("-password"); //we don't want the password
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    }
    catch(error : any){
        return NextResponse.json({error : error.message}, {status : 500})
    }
}