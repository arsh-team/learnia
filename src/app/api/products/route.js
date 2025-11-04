import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const products = await Product.find({})
      .select('-curriculum -prerequisites -features -whatYouLearn')
      .lean();

    console.log("Products from DB:", products.map(p => ({ title: p.title, _id: p._id })));

    const transformedProducts = products.map(product => ({
      ...product,
      id: product._id, 
      _id: product._id 
    }));

    return new Response(JSON.stringify(transformedProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ error: "خطا در دریافت محصولات" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}