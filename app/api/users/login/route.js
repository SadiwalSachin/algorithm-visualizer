import { dbConnection } from "@/db/dbConnection";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await dbConnection();

    const reqBody = await request.json();

    console.log(reqBody);

    const { email, password } = reqBody;

    // apply validation

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User doesnot exist with this email");
      return NextResponse.json(
        { error: "User doesnot exist with this email", success: false },
        { status: 400 }
      );
    }

    console.log("User exist");

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Check your credentials");
      return NextResponse.json(
        { error: "Check your credentials", success: false },
        { status: 400 }
      );
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "2d",
    });

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
      token,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.log("Error occured in login route", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
