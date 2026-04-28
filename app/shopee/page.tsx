import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import ProductListing from '@/components/sections/ProductListing';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/components/ui/ProductCard';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ofertas Shopee | promotodahoraBR',
  description: 'As melhores promoções e achadinhos da Shopee.',
};

export default async function ShopeePage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('platform', 'shopee')
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
          Ofertas <span style={{ color: '#EE4D2D' }}>Shopee</span>
        </h1>
      </div>
      <ProductListing products={formattedProducts} categories={categories} platform="shopee" />
    </div>
  );
}
