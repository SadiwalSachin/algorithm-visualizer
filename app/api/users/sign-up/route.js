import { dbConnection } from "@/db/dbConnection";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import sendEmail from "@/helpers/mailer";


export async function POST(request) {
  try {
    
    await dbConnection();
    const reqBody = await request.json();

    console.log(reqBody);

    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields (username, email, password) are required.",
          success:false
         },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
        console.log("User already found",user);
      return NextResponse.json(
        { error: "User already exist with this email",
          success:false
         },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save()

    console.log("New user is saved ",savedUser);
    
    // send verification email

    await sendEmail({email,emailType:"VERIFY",userId:savedUser?._id})

    console.log("send email is called");
    
    return NextResponse.json({
        message:"User registered successfully",
        success:true,
        savedUser
    })

  } catch (error) {
    console.log("Error occured in sign up route", error);
    return NextResponse.json(
      {
        error: error?.message,
        success:false
      },
      { status: 500 }
    );
  }
}
