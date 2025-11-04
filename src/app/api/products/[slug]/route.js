import { NextResponse } from 'next/server';
import Product from '../../../../models/Product';
import { connectDB } from '../../../../lib/db';

export async function GET(request, context) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات محصول' },
      { status: 500 }
    );
  }
}
