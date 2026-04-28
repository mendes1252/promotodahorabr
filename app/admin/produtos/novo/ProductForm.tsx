'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default function ProductForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    platform: 'amazon',
    category: 'eletronicos',
    price_original: '',
    price_promo: '',
    affiliate_url: '',
    active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Converter preços para centavos (ex: 199.90 -> 19990)
    const originalCents = Math.round(parseFloat(formData.price_original.replace(',', '.')) * 100);
    const promoCents = Math.round(parseFloat(formData.price_promo.replace(',', '.')) * 100);
    
    // Calcular desconto
    const discountPct = Math.round(((originalCents - promoCents) / originalCents) * 100);

    const productData = {
      name: formData.name,
      description: formData.description,
      image_url: formData.image_url,
      platform: formData.platform,
      category: formData.category,
      price_original: originalCents,
      price_promo: promoCents,
      discount_pct: discountPct,
      affiliate_url: formData.affiliate_url,
      active: formData.active,
      clicks: 0
    };

    const { error: insertError } = await supabase
      .from('products')
      .insert([productData]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/admin/produtos');
      router.refresh();
    }
  };

  return (
    <div className={styles.formCard}>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>Erro: {error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="name">Nome do Produto</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className={styles.input} 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Ex: Smartphone Samsung Galaxy S23"
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="description">Descrição Curta</label>
          <textarea 
            id="description" 
            name="description" 
            className={styles.textarea} 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Breve descrição dos principais atrativos."
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="image_url">URL da Imagem</label>
          <input 
            type="url" 
            id="image_url" 
            name="image_url" 
            className={styles.input} 
            value={formData.image_url} 
            onChange={handleChange} 
            required 
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="platform">Plataforma</label>
          <select 
            id="platform" 
            name="platform" 
            className={styles.select} 
            value={formData.platform} 
            onChange={handleChange}
          >
            <option value="amazon">Amazon</option>
            <option value="shopee">Shopee</option>
            <option value="mercadolivre">Mercado Livre</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="category">Categoria</label>
          <select 
            id="category" 
            name="category" 
            className={styles.select} 
            value={formData.category} 
            onChange={handleChange}
          >
            <option value="eletronicos">Eletrônicos</option>
            <option value="moda">Moda</option>
            <option value="casa">Casa</option>
            <option value="cama-mesa-banho">Cama, Mesa e Banho</option>
            <option value="saude">Saúde e Bem Estar</option>
            <option value="beleza">Beleza</option>
            <option value="kids">Kids</option>
            <option value="ferramentas">Ferramentas</option>
            <option value="livros">Livros</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="price_original">Preço Original (R$)</label>
          <input 
            type="number" 
            step="0.01" 
            id="price_original" 
            name="price_original" 
            className={styles.input} 
            value={formData.price_original} 
            onChange={handleChange} 
            required 
            placeholder="Ex: 299.90"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="price_promo">Preço Promocional (R$)</label>
          <input 
            type="number" 
            step="0.01" 
            id="price_promo" 
            name="price_promo" 
            className={styles.input} 
            value={formData.price_promo} 
            onChange={handleChange} 
            required 
            placeholder="Ex: 199.90"
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="affiliate_url">Link de Afiliado</label>
          <input 
            type="url" 
            id="affiliate_url" 
            name="affiliate_url" 
            className={styles.input} 
            value={formData.affiliate_url} 
            onChange={handleChange} 
            required 
            placeholder="Seu link com rastreio da parceira"
          />
        </div>

        <div className={styles.inputGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="active" 
            name="active" 
            checked={formData.active} 
            onChange={handleChange}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="active" style={{ cursor: 'pointer' }}>Produto Ativo (Visível no site)</label>
        </div>

        <div className={`${styles.formActions} ${styles.fullWidth}`}>
          <Link href="/admin/produtos" className={styles.secondaryButton}>
            Cancelar
          </Link>
          <button type="submit" disabled={loading} className={styles.primaryButton} style={{ border: 'none' }}>
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}
