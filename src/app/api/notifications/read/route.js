import { connectDB } from "../../../../lib/db";
import { getUserIdFromToken } from "../../../../lib/auth";
import Notification from "../../../../models/Notification";

export async function PUT(request) {
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

    const body = await request.json();
    const { notificationId, markAll } = body;

    let result;

    if (markAll) {
      result = await Notification.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true } }
      );
      console.log("Marked all notifications as read for user:", userId);
    } else if (notificationId) {
      result = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { $set: { isRead: true } },
        { new: true }
      );
      console.log("Marked notification as read:", notificationId);
    } else {
      return new Response(
        JSON.stringify({ error: "notificationId or markAll required" }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const unreadCount = await Notification.countDocuments({ 
      user: userId, 
      isRead: false 
    });

    console.log("Unread count after update:", unreadCount);

    return new Response(
      JSON.stringify({ 
        success: true,
        unreadCount 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return new Response(
      JSON.stringify({ error: "خطا در بروزرسانی وضعیت اعلان" }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}