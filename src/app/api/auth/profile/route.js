import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function PUT(request) {
  try {
    await connectDB();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ error: "توکن احراز هویت یافت نشد" }), {
        status: 401,
      });
    }

    // verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ error: "توکن نامعتبر است" }), {
        status: 401,
      });
    }

    const { username, firstname, lastname, age } = await request.json();
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { 
        username,
        firstname, 
        lastname, 
        age: age ? parseInt(age) : undefined 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return new Response(JSON.stringify({ error: "کاربر یافت نشد" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ error: "خطا در بروزرسانی پروفایل" }), {
      status: 500,
    });
  }
}


