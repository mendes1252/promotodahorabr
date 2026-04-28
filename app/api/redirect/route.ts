import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');

  if (!productId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const supabase = createClient();

  // 1. Fetch the product to get the affiliate URL and current clicks
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('affiliate_url, clicks')
    .eq('id', productId)
    .single();

  if (fetchError || !product) {
    console.error('Error fetching product for redirect:', fetchError);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Increment clicks in the background (we don't await this to keep redirect fast)
  // But since we are on Edge/Serverless, we should await it to ensure it runs before process dies.
  // Using RPC is better for concurrency, but a simple update works for MVP.
  await supabase
    .from('products')
    .update({ clicks: (product.clicks || 0) + 1 })
    .eq('id', productId);

  // 3. Redirect to the actual affiliate URL
  return NextResponse.redirect(product.affiliate_url);
}
