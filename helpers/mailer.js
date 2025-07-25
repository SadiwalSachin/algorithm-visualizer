import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export default async function sendEmail({ email, emailType, userId }) {
  try {
    console.log("in send email function1", email, emailType, userId);

    const hashedToken = await bcryptjs.hash(userId?.toString(), 10);

    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass:process.env.USER_PASS,
      },
    });

    const link = `${process.env.DOMAIN}/verify-email?token=${hashedToken}`;
    const actionText =
      emailType === "VERIFY" ? "Verify your Email" : "Reset your Password";
    const messageIntro =
      emailType === "VERIFY"
        ? "Welcome to Algorithm Visualizer! Let's get you started."
        : "We received a request to reset your password.";
    const messageInstruction =
      emailType === "VERIFY"
        ? "Click the button below to verify your email address and activate your account:"
        : "Click the button below to reset your password:";
    const fallbackNote =
      emailType === "VERIFY"
        ? "If you didn't create an account, you can safely ignore this email."
        : "If you didn’t request a password reset, you can ignore this email.";

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
       <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Algorithm Visualizer</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #0f172a;">${actionText}</h2>
        <p>${messageIntro}</p>
        <p>${messageInstruction}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 25px; background-color: #0f172a; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${actionText}
          </a>
        </div>
        <p>If the button above doesn't work, you can copy and paste the link below into your browser:</p>
        <p style="word-break: break-all; color: #4b5563;">${link}</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 14px; color: #6b7280;">${fallbackNote}</p>
      </div>
    </div>
  </div>
`;

    const mailOptions = {
      from: "sachinsadiwal7615@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
      html: html,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    console.log("send email response", mailResponse);

    return mailResponse;
  } catch (error) {
    console.log("Some error occured while sending mail to user");
    console.error(error);
    throw new Error(error?.message);
  }
}
