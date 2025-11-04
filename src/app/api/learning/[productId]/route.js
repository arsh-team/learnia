import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/Product";
import Lesson from "../../../../models/Lesson";
import Assignment from "../../../../models/Assignment";
import Quiz from "../../../../models/Quiz";
import UserProgress from "../../../../models/UserProgress";
import Enrollment from "../../../../models/Enrollment";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(request, { params }) {
  try {
    // await params قبل از استفاده
    const { productId } = await params;
    
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

    // بررسی اینکه کاربر در دوره ثبت‌نام کرده یا نه
    const enrollment = await Enrollment.findOne({
      user: decoded.id,
      product: productId
    });

    if (!enrollment) {
      return new Response(
        JSON.stringify({ error: "شما در این دوره ثبت‌نام نکرده‌اید" }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // دریافت اطلاعات دوره
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return new Response(
        JSON.stringify({ error: "دوره مورد نظر یافت نشد" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // دریافت دروس
    const lessons = await Lesson.find({ product: productId }).sort({ order: 1 });

    // دریافت تکالیف
    const assignments = await Assignment.find({ product: productId });

    // دریافت آزمون‌ها
    const quizzes = await Quiz.find({ product: productId });

    // دریافت پیشرفت کاربر
    const userProgress = await UserProgress.find({
      user: decoded.id,
      product: productId
    });

    return new Response(
      JSON.stringify({
        product,
        lessons,
        assignments,
        quizzes,
        userProgress,
        isEnrolled: true
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error fetching learning data:", error);
    return new Response(
      JSON.stringify({ error: "خطا در دریافت اطلاعات دوره: " + error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}