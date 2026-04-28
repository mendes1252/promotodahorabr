import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ whatsappLink: '' });
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const settings = JSON.parse(fileContents);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Erro ao ler configurações:', error);
    return NextResponse.json({ error: 'Erro ao ler configurações' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    
    let settings = { whatsappLink: '' };
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      settings = JSON.parse(fileContents);
    }
    
    settings = { ...settings, ...newSettings };
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Configurações salvas com sucesso!', settings });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json({ success: false, message: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
