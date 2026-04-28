import Image from 'next/image';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  platform: 'amazon' | 'shopee' | 'mercadolivre';
  category: string;
  priceOriginal: number;
  pricePromo: number;
  discountPct: number;
  affiliateUrl: string;
  featured: boolean;
  active: boolean;
}

interface ProductCardProps {
  product: Product;
  onClickDetails: (product: Product) => void;
}

export default function ProductCard({ product, onClickDetails }: ProductCardProps) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'amazon': return 'Amazon';
      case 'shopee': return 'Shopee';
      case 'mercadolivre': return 'Mercado Livre';
      default: return platform;
    }
  };

  return (
    <div className={`${styles.card} ${product.featured ? styles.featured : ''}`}>
      {product.featured && <div className={styles.featuredBadge}>Destaque</div>}
      
      <div className={styles.imageArea} onClick={() => onClickDetails(product)}>
        <Image 
          src={product.imageUrl} 
          alt={product.name} 
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.discountBadge}>-{product.discountPct}%</div>
        <div className={`${styles.platformBadge} ${styles[product.platform]}`}>
          {getPlatformLabel(product.platform)}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title} onClick={() => onClickDetails(product)}>
          {product.name}
        </h3>
        
        <div className={styles.priceArea}>
          <span className={styles.priceOriginal}>{formatPrice(product.priceOriginal)}</span>
          <span className={styles.pricePromo}>{formatPrice(product.pricePromo)}</span>
        </div>

        <a 
          href={`/api/redirect?id=${product.id}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`${styles.ctaButton} ${styles[`btn-${product.platform}`]}`}
        >
          Comprar agora
        </a>
      </div>
    </div>
  );
}
