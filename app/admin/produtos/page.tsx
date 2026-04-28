import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import styles from '../admin.module.css';
import ProductActions from './ProductActions';

export default async function ProdutosPage() {
  const supabase = createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Produtos</h1>
        <Link href="/admin/produtos/novo" className={styles.primaryButton}>
          <Plus size={20} />
          Novo Produto
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Plataforma</th>
              <th>Preço Promo</th>
              <th>Cliques</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image_url && (
                      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                        <Image 
                          src={p.image_url} 
                          alt={p.name}
                          fill
                          className={styles.productImageCell}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {p.platform === 'mercadolivre' ? 'Mercado Livre' : p.platform}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-green)' }}>
                    {formatPrice(p.price_promo)}
                  </td>
                  <td>{p.clicks}</td>
                  <td>
                    <span className={`${styles.badge} ${p.active ? styles.active : styles.inactive}`}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <ProductActions id={p.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
