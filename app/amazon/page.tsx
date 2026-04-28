import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import ProductListing from '@/components/sections/ProductListing';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/components/ui/ProductCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ofertas Amazon | promotodahoraBR',
  description: 'As melhores promoções e achadinhos da Amazon.',
};

export default async function AmazonPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('platform', 'amazon')
    .eq('active', true)
    .order('created_at', { ascending: false });

  let categories = [];
  try {
    const catsPath = path.join(process.cwd(), 'data', 'categories.json');
    if (fs.existsSync(catsPath)) {
      categories = JSON.parse(fs.readFileSync(catsPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading categories:', e);
  }

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
    <div style={{ paddingTop: '20px' }}>
      <div className="container" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--color-blue)', fontWeight: 800 }}>
          Ofertas <span style={{ color: '#008037' }}>Amazon</span>
        </h1>
      </div>
      <ProductListing products={formattedProducts} categories={categories} platform="amazon" />
    </div>
  );
}
