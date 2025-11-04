// app/api/auth/route.js
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  await connectDB();
  const { mode, email, password, firstname, lastname } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email & password required" }), { status: 400 });
  }

  if (mode === "register") {
    let existing = await User.findOne({ email });
    if (existing) return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });

    const user = new User({ email, password, firstname, lastname });
    await user.save();

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1y" });
    return new Response(JSON.stringify({ success: true, token }), { status: 201 });
  }

  if (mode === "login") {
    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1y" });
    return new Response(JSON.stringify({ success: true, token }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid mode" }), { status: 400 });
}
