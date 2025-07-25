import { dbConnection } from "@/db/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    await dbConnection()

    const response = NextResponse.json({
      message: "Logout successfully",
      success: true,
    });

    response.cookies.set("token", "",{
        httpOnly:true,
        expires:new Date(0)
    });

    return response

  } catch (error) {
    console.log("Error occured in logout route", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
