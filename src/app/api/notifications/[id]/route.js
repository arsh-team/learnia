import { connectDB } from "../../../../lib/db";
import { getUserIdFromToken } from "../../../../lib/auth";
import Notification from "../../../../models/Notification";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // دریافت توکن از header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "دسترسی غیرمجاز" }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // استخراج userId از توکن
    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "توکن نامعتبر" }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const { id } = params;

    const result = await Notification.findOneAndDelete({ 
      _id: id, 
      user: userId 
    });

    if (!result) {
      return new Response(
        JSON.stringify({ error: "اعلان یافت نشد" }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Notification deleted:", id);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Error deleting notification:", error);
    return new Response(
      JSON.stringify({ error: "خطا در حذف اعلان" }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}