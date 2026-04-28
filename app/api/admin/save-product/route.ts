import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    
    const supabase = createClient();
    
    // Mapeando dados do formato camelCase (Frontend) para snake_case (Banco de Dados)
    const productData = {
      name: newProduct.name,
      description: newProduct.description,
      image_url: newProduct.imageUrl,
      platform: newProduct.platform,
      category: newProduct.category,
      price_original: newProduct.priceOriginal,
      price_promo: newProduct.pricePromo,
      discount_pct: newProduct.discountPct,
      affiliate_url: newProduct.affiliateUrl,
      active: true
    };
    
    const { error } = await supabase
      .from('products')
      .insert([productData]);
      
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message);
    }
    
    return NextResponse.json({ success: true, message: 'Produto salvo no banco de dados com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao salvar produto:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Erro ao salvar produto' }, { status: 500 });
  }
}
