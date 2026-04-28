import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID não fornecido' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, message: 'Produto excluído com sucesso' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erro ao excluir produto:', err);
    return NextResponse.json({ success: false, message: err?.message || 'Erro ao excluir produto' }, { status: 500 });
  }
}
