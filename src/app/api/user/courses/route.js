import { connectDB } from "../../../../lib/db";
import Enrollment from "../../../../models/Enrollment";
import Product from "../../../../models/Product";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: "توکن احراز هویت یافت نشد" }, 
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      return Response.json(
        { error: "توکن نامعتبر است" }, 
        { status: 401 }
      );
    }

    const enrollments = await Enrollment.find({ user: decoded.id })
      .populate('product')
      .sort({ lastAccessed: -1 });

    return Response.json(enrollments);
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return Response.json(
      { error: "خطا در دریافت دوره‌ها" }, 
      { status: 500 }
    );
  }
}