import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'categories.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const categories = JSON.parse(fileContents);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro ao ler categorias:', error);
    return NextResponse.json({ error: 'Erro ao ler categorias' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCategory = await request.json();
    
    // Caminho absoluto
    const filePath = path.join(process.cwd(), 'data', 'categories.json');
    
    let categories = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      categories = JSON.parse(fileContents);
    }
    
    // Verifica se já existe
    if (categories.find((c: { id: string }) => c.id === newCategory.id)) {
      return NextResponse.json({ success: false, message: 'Categoria já existe!' }, { status: 400 });
    }
    
    categories.push(newCategory);
    
    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Categoria salva com sucesso!', categories });
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    return NextResponse.json({ success: false, message: 'Erro ao salvar categoria' }, { status: 500 });
  }
}
