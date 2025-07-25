import { dbConnection } from "@/db/dbConnection";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {

    await dbConnection()

    const userId = await getDataFromToken(request)

    console.log("userId :",userId);

    const user = await User.findOne({_id:userId}).select("-password")

    if(!user){
        console.log("Invalid token");
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({message:"User found",success:true,user},{status:200})

    // extract data from token

  } catch (error) {
    console.log("Error occured in about route", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
