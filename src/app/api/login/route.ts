import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { mobile, password } = await req.json();

    await dbConnect();

    const user = await User.findOne({ mobile });
    if (!user) {
      return new Response("User not found", { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response("Invalid password", { status: 401 });
    }

    return new Response("Login successful", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Server error", { status: 500 });
  }
}