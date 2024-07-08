import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import toast from "react-hot-toast";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email } = reqBody;

        console.log(reqBody);

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            await sendEmail({ email, emailType: "RESET", userId: user._id });

            return NextResponse.json({
                message: "Password Reseted successfully",
                success: true,
                user
            });
        }        
        else{
            return toast.error("User does not exists");
        }
    } catch (error: any) {
        console.error('Error in POST request:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
