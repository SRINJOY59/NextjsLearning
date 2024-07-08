import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, newPassword, token } = reqBody;

    console.log(reqBody);

    // Check if user exists and token is valid
    const user = await User.findOne({
      username,
      email,
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or Expired token" }, { status: 400 });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    // Redirect the user to the login page
    const response = NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
    response.headers.set("Location", "/login");
    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
