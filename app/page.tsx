import fs from 'fs';
import path from 'path';
import HeroBanner from '@/components/sections/HeroBanner';
import ProductListing from '@/components/sections/ProductListing';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/components/ui/ProductCard';

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  // Load categories
  let categories = [];
  try {
    const catsPath = path.join(process.cwd(), 'data', 'categories.json');
    if (fs.existsSync(catsPath)) {
      categories = JSON.parse(fs.readFileSync(catsPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading categories:', e);
  }

  // Map to the frontend interface (camelCase vs snake_case)
  const formattedProducts: Product[] = (products || []).map(p => ({
    id: p.id.toString(),
    name: p.name,
    description: p.description || '',
    imageUrl: p.image_url,
    platform: p.platform,
    category: p.category,
    priceOriginal: p.price_original,
    pricePromo: p.price_promo,
    discountPct: p.discount_pct,
    affiliateUrl: p.affiliate_url,
    featured: false,
    active: p.active
  }));

  return (
    <>
      <HeroBanner />
      <ProductListing products={formattedProducts} categories={categories} />
    </>
  );
}
