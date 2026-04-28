'use client';
import { useState, useEffect } from 'react';
import { 
  Smartphone, Shirt, Home, Sparkles, BookOpen, BedDouble, HeartPulse, Baby, Wrench,
  Gamepad, Music, Camera, Utensils, Gift, Car, Coffee, Dumbbell, Glasses, Plane, Star, Tag, ShoppingBag, Watch
} from 'lucide-react';
import styles from './page.module.css';

const ICON_BANK = [
  { name: 'Smartphone', icon: <Smartphone size={20} /> },
  { name: 'Shirt', icon: <Shirt size={20} /> },
  { name: 'Home', icon: <Home size={20} /> },
  { name: 'Sparkles', icon: <Sparkles size={20} /> },
  { name: 'BookOpen', icon: <BookOpen size={20} /> },
  { name: 'BedDouble', icon: <BedDouble size={20} /> },
  { name: 'HeartPulse', icon: <HeartPulse size={20} /> },
  { name: 'Baby', icon: <Baby size={20} /> },
  { name: 'Wrench', icon: <Wrench size={20} /> },
  { name: 'Gamepad', icon: <Gamepad size={20} /> },
  { name: 'Music', icon: <Music size={20} /> },
  { name: 'Camera', icon: <Camera size={20} /> },
  { name: 'Utensils', icon: <Utensils size={20} /> },
  { name: 'Gift', icon: <Gift size={20} /> },
  { name: 'Car', icon: <Car size={20} /> },
  { name: 'Coffee', icon: <Coffee size={20} /> },
  { name: 'Dumbbell', icon: <Dumbbell size={20} /> },
  { name: 'Glasses', icon: <Glasses size={20} /> },
  { name: 'Plane', icon: <Plane size={20} /> },
  { name: 'Star', icon: <Star size={20} /> },
  { name: 'Tag', icon: <Tag size={20} /> },
  { name: 'ShoppingBag', icon: <ShoppingBag size={20} /> },
  { name: 'Watch', icon: <Watch size={20} /> }
];

interface Category {
  id: string;
  label: string;
  iconName: string;
}

import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Star');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    imageUrl: '',
    platform: 'amazon',
    category: '', // starts empty, will be set when categories load
    priceOriginal: '',
    pricePromo: '',
    affiliateUrl: '',
    featured: false,
  });

  const [templateIndex, setTemplateIndex] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].id }));
        }
      });

    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.whatsappLink) {
          setWhatsappLink(data.whatsappLink);
        }
      });

    // Check if we are in Edit mode
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (editId) {
      const supabase = createClient();
      supabase
        .from('products')
        .select('*')
        .eq('id', editId)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setFormData({
              id: data.id,
              name: data.name,
              description: data.description || '',
              imageUrl: data.image_url || '',
              platform: data.platform,
              category: data.category,
              priceOriginal: (data.price_original / 100).toFixed(2).replace('.', ','),
              pricePromo: (data.price_promo / 100).toFixed(2).replace('.', ','),
              affiliateUrl: data.affiliate_url || '',
              featured: data.featured || false,
            });
          }
        });
    }
  }, []);

  const handleSaveCategory = async () => {
    if (!newCatName) return;
    const newCat = {
      id: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: newCatName,
      iconName: newCatIcon
    };
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setFormData(prev => ({ ...prev, category: newCat.id }));
        setShowNewCat(false);
        setNewCatName('');
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar categoria');
    }
  };

  // Calcula o desconto real
  const calcDiscount = () => {
    const orig = parseFloat(formData.priceOriginal.replace(',', '.'));
    const promo = parseFloat(formData.pricePromo.replace(',', '.'));
    if (orig && promo && orig > promo) {
      return Math.round(((orig - promo) / orig) * 100);
    }
    return 0;
  };

  const formatBRL = (val: string) => {
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // 5 Modelos de Alta Conversão
  const getTemplate = (index: number) => {
    const nome = formData.name || '[Nome do Produto]';
    const desc = formData.description || '[Descrição rápida do produto e benefício]';
    const link = formData.affiliateUrl || '[Seu Link de Afiliado]';
    const pOrig = formatBRL(formData.priceOriginal);
    const pPromo = formatBRL(formData.pricePromo);
    const descPct = calcDiscount();

    const templates = [
`🚨 *OFERTA RELÂMPAGO!* 🚨

*${nome}*
${desc}

❌ De: ${pOrig}
✅ Por apenas: *${pPromo}* 🔥
${descPct > 0 ? `(São ${descPct}% de desconto!)` : ''}

🛒 *Compre aqui:* ${link}

⚠️ _Atenção:_ O preço pode alterar a qualquer momento!`,

`💥 *CAIU O PREÇO!* 💥
Alerta de desconto imperdível!

*${nome}*
${desc}

💰 Preço absurdo de bom: *${pPromo}*!
(Tava custando ${pOrig}... corre que é bug ou queima de estoque!)

👉 *Garante o seu no link:* ${link}

🏃‍♂️🏃‍♀️ Acaba muito rápido, não deixa pra depois!`,

`🔎 *ACHADINHO DO DIA!* 🔎
Olha o que eu acabei de encontrar com um preço maravilhoso! 😍

*${nome}*
✨ ${desc}

💸 Investimento: Só *${pPromo}*!
(Preço normal é ${pOrig})

🛍️ *Clica no link pra ver mais detalhes e comprar:*
🔗 ${link}

Gostou? Já manda pra quem tava procurando isso! 👇`,

`⏳ *CORRE QUE VAI ACABAR!* ⏳
Últimas unidades com esse preço!

*${nome}*

📉 Baixou de ${pOrig} para *${pPromo}*!

Aproveite enquanto ainda tem no estoque!
🛒 *Link da oferta:* ${link}`,

`🛍️ *OFERTA: ${nome}* 🛍️

${desc}

💵 Por apenas: *${pPromo}*
(Desconto exclusivo de ${descPct}%)

👉 *Acesse:* ${link}`
    ];

    return templates[index];
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCustomMessage(getTemplate(templateIndex));
  }, [formData, templateIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getProductJson = () => {
    const orig = parseFloat(formData.priceOriginal.replace(',', '.')) || 0;
    const promo = parseFloat(formData.pricePromo.replace(',', '.')) || 0;
    
    return {
      id: formData.id || undefined,
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      platform: formData.platform,
      category: formData.category,
      priceOriginal: Math.round(orig * 100),
      pricePromo: Math.round(promo * 100),
      discountPct: calcDiscount(),
      affiliateUrl: formData.affiliateUrl,
      featured: formData.featured
    };
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    try {
      const product = getProductJson();
      const res = await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        alert(formData.id ? 'Produto atualizado com sucesso!' : 'Produto salvo no site com sucesso!');
        if (formData.id) {
          window.location.href = '/admin/produtos';
        } else {
          // Clear form optionally, or just leave it
          setFormData({
            id: '',
            name: '',
            description: '',
            imageUrl: '',
            platform: 'amazon',
            category: categories.length > 0 ? categories[0].id : '',
            priceOriginal: '',
            pricePromo: '',
            affiliateUrl: '',
            featured: false,
          });
        }
      } else {
        alert(`Erro ao salvar: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappLink }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Configurações salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar configurações.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Configurações Globais */}
      <div className={styles.panel}>
        <h2 className={styles.title}>Configurações do Site</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Link do Grupo VIP (WhatsApp)</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input 
              className={styles.input} 
              value={whatsappLink} 
              onChange={e => setWhatsappLink(e.target.value)} 
              placeholder="Ex: https://chat.whatsapp.com/..." 
              style={{ flex: 1 }}
            />
            <button 
              className={styles.submitBtn} 
              style={{ width: 'auto', padding: '0 24px' }}
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
            >
              {isSavingSettings ? 'Salvando...' : 'Salvar Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className={styles.panel}>
        <h2 className={styles.title}>{formData.id ? '1. Editando Oferta' : '1. Cadastro da Oferta'}</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome do Produto</label>
          <input className={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Fritadeira Air Fryer..." />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição (Benefício Rápido)</label>
          <textarea className={styles.textarea} name="description" value={formData.description} onChange={handleChange} placeholder="Ex: Fritadeira elétrica sem óleo..."></textarea>
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Preço Original (R$)</label>
            <input className={styles.input} type="number" step="0.01" name="priceOriginal" value={formData.priceOriginal} onChange={handleChange} placeholder="499.90" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Preço Promocional (R$)</label>
            <input className={styles.input} type="number" step="0.01" name="pricePromo" value={formData.pricePromo} onChange={handleChange} placeholder="289.90" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Link da Imagem (URL)</label>
          <input className={styles.input} name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Plataforma</label>
            <select className={styles.select} name="platform" value={formData.platform} onChange={handleChange}>
              <option value="amazon">Amazon</option>
              <option value="shopee">Shopee</option>
              <option value="mercadolivre">Mercado Livre</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria</label>
            <select className={styles.select} name="category" value={formData.category} onChange={handleChange}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <button className={styles.addCategoryBtn} onClick={() => setShowNewCat(!showNewCat)}>
              + Nova Categoria
            </button>

            {showNewCat && (
              <div className={styles.newCategoryBox}>
                <label className={styles.label}>Nome da Categoria</label>
                <input 
                  className={styles.input} 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  placeholder="Ex: Games" 
                />
                
                <label className={styles.label} style={{ marginTop: '8px' }}>Escolha um Ícone</label>
                <div className={styles.iconBank}>
                  {ICON_BANK.map(iconObj => (
                    <div 
                      key={iconObj.name}
                      className={`${styles.iconOption} ${newCatIcon === iconObj.name ? styles.selected : ''}`}
                      onClick={() => setNewCatIcon(iconObj.name)}
                      title={iconObj.name}
                    >
                      {iconObj.icon}
                    </div>
                  ))}
                </div>

                <button className={styles.saveCatBtn} onClick={handleSaveCategory}>Adicionar Categoria</button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Seu Link de Afiliado (Direto p/ loja)</label>
          <input className={styles.input} name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} placeholder="https://amzn.to/..." />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            Destacar este produto no site?
          </label>
        </div>

      </div>

      {/* Gerador e Ações */}
      <div className={styles.panel}>
        <h2 className={styles.title}>2. Resultados & Postagem</h2>

        <div className={styles.resultBox}>
          <div className={styles.resultTitle}>
            <span>Mensagem para WhatsApp</span>
            <button className={styles.copyBtn} onClick={() => handleCopyText(customMessage)}>Copiar Texto</button>
          </div>
          
          <div className={styles.templatesContainer}>
            {['Padrão Urgente', 'Caiu o Preço!', 'Achadinho', 'Estoque Limitado', 'Direto e Reto'].map((label, idx) => (
              <button 
                key={idx}
                className={`${styles.templateBtn} ${templateIndex === idx ? styles.active : ''}`}
                onClick={() => setTemplateIndex(idx)}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea 
            className={styles.messageArea} 
            value={customMessage} 
            onChange={(e) => setCustomMessage(e.target.value)}
          ></textarea>
          <small style={{ color: '#666', fontSize: '12px' }}>* Você pode editar a mensagem acima antes de copiar!</small>
        </div>

        <div className={styles.resultBox}>
          <div className={styles.resultTitle}>
            <span>Salvar no Site</span>
          </div>
          <button 
            className={styles.submitBtn} 
            onClick={handleSaveProduct} 
            disabled={isSaving || !formData.name || !formData.pricePromo}
          >
            {isSaving ? 'Salvando...' : (formData.id ? 'Atualizar Oferta no Site' : 'Salvar Oferta no Site Automaticamente')}
          </button>
          <p style={{ marginTop: '12px', fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
            Ao clicar em salvar, o produto será adicionado diretamente no Supabase e aparecerá instantaneamente na Home Page.
          </p>
        </div>

      </div>
    </div>
  );
}
