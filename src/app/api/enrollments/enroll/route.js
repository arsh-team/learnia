import { connectDB } from "../../../../lib/db";
import Enrollment from "../../../../models/Enrollment";
import Product from "../../../../models/Product";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(request) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "توکن احراز هویت یافت نشد" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "توکن نامعتبر است" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { productId } = await request.json();

    console.log("Enrollment request for product:", productId); // دیباگ

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "شناسه دوره ارسال نشده است" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // بررسی وجود دوره
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(
        JSON.stringify({ error: "دوره مورد نظر یافت نشد" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // بررسی اینکه کاربر قبلاً ثبت‌نام نکرده باشد
    const existingEnrollment = await Enrollment.findOne({
      user: decoded.id,
      product: productId
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ 
          error: "شما قبلاً در این دوره ثبت‌نام کرده‌اید",
          enrollment: existingEnrollment 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ایجاد ثبت‌نام جدید
    const enrollment = new Enrollment({
      user: decoded.id,
      product: productId,
      enrolledAt: new Date(),
      progress: 0,
      completed: false,
      lastAccessed: new Date()
    });

    await enrollment.save();

    // افزایش تعداد دانشجویان دوره
    await Product.findByIdAndUpdate(productId, {
      $inc: { studentsCount: 1 }
    });

    // پر کردن اطلاعات دوره و کاربر
    await enrollment.populate('product', 'title category level hours rating score teacher image');
    await enrollment.populate('user', 'firstname lastname email');

    return new Response(
      JSON.stringify({ 
        message: "ثبت‌نام با موفقیت انجام شد",
        enrollment 
      }), 
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error creating enrollment:", error);
    return new Response(
      JSON.stringify({ error: "خطا در ثبت‌نام" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}