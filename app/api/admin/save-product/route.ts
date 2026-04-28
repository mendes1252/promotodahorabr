import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    
    const supabase = createClient();
    
    // Mapeando dados do formato camelCase (Frontend) para snake_case (Banco de Dados)
    const productData: any = {
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
    
    let error;

    if (newProduct.id) {
      // Atualizar produto existente
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', newProduct.id);
      error = updateError;
    } else {
      // Inserir novo
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);
      error = insertError;
    }
      
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message);
    }
    
    return NextResponse.json({ success: true, message: 'Produto salvo no banco de dados com sucesso!' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erro ao salvar produto:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erro ao salvar produto' }, { status: 500 });
  }
}
