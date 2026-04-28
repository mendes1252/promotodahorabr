'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductModal.module.css';
import { Product } from './ProductCard';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.imageArea}>
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className={styles.details}>
            <div className={styles.header}>
              <span className={styles.category}>{product.category}</span>
              <span className={styles.discount}>-{product.discountPct}% de desconto</span>
            </div>
            
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.priceContainer}>
              <span className={styles.oldPrice}>{formatPrice(product.priceOriginal)}</span>
              <span className={styles.newPrice}>{formatPrice(product.pricePromo)}</span>
            </div>
            
            <a 
              href={`/api/redirect?id=${product.id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.ctaButton} ${styles[`btn-${product.platform}`]}`}
            >
              Comprar na {product.platform === 'mercadolivre' ? 'Mercado Livre' : product.platform}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
