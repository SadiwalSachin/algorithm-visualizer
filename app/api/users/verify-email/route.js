import { dbConnection } from "@/db/dbConnection";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await dbConnection()

    console.log("verify email route called");
    
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log("token coming in verify route", token);

    if (!token) {
      console.log("Token not found");
      return NextResponse.json({
        success: false,
        error: "Token is required",
      });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    console.log("user : ", user);

    if (!user) {
      console.log("token is invalid");
      return NextResponse.json({
        success: false,
        error: "Token is invalid",
      }, { status: 400 });
    }

    // updating the fields in mongodb
    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save()

    console.log("User is verified");

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error occured in verify email route");
    console.error(error);
    return NextResponse.json(
      { success: false, message: error?.message },
      { status: 500 }
    );
  }
}
