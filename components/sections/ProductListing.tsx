'use client';
import { useState } from 'react';
import CategoryBar from './CategoryBar';
import ProductCard, { Product } from '../ui/ProductCard';
import ProductModal from '../ui/ProductModal';
import styles from './ProductListing.module.css';

interface ProductListingProps {
  products: Product[];
  categories: { id: string; label: string; iconName: string }[];
  platform?: 'amazon' | 'shopee' | 'mercadolivre';
}

export default function ProductListing({ products, categories, platform }: ProductListingProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by platform (if specified) and category
  const filteredProducts = products.filter(p => {
    if (platform && p.platform !== platform) return false;
    if (activeCategory && p.category !== activeCategory) return false;
    return p.active;
  });

  return (
    <div className={styles.listingWrapper} id="ofertas">
      <CategoryBar 
        categories={categories}
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />
      
      <div className={styles.container}>
        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClickDetails={setSelectedProduct} 
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            Nenhuma oferta encontrada para este filtro no momento.
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
