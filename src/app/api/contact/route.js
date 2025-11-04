import { resolve } from "path";
import { connectDB } from "../../../lib/db";
import Contact from "../../../models/Contact";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone = "", message } = body || {};

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "لطفا نام، ایمیل و پیام را وارد کنید." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
    const userAgent = request.headers.get("user-agent") || "";

    const doc = await Contact.create({ name, email, phone, message, ip, userAgent });

    return new Response(JSON.stringify({ ok: true, id: doc._id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    return new Response(JSON.stringify({ error: "خطا در ثبت پیام" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  // Optional: provide a safe read endpoint if needed in future. For now, return 405.
  return new Response(null, { status: 405 });
}
