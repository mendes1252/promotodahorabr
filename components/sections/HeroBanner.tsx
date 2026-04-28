'use client';
import Image from 'next/image';
import { Package, ShoppingBag, ShoppingCart, Tag, Coins, Ticket, Gift, PartyPopper } from 'lucide-react';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const scrollToOffers = () => {
    const offersSection = document.getElementById('ofertas');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>Destaque</div>
          <h1 className={styles.title}>
            As melhores ofertas do <span className={styles.highlight}>Brasil</span> em um só lugar.
          </h1>
          <p className={styles.subtitle}>
            Encontramos e filtramos descontos reais na Amazon, Shopee e Mercado Livre para você não perder tempo.
          </p>
          <button onClick={scrollToOffers} className={styles.cta}>
            Ver Ofertas
          </button>
        </div>
        
        <div className={styles.imageWrapper}>
          {/* Background Floating Elements clustered around mascot */}
          <div className={styles.floatingElements}>
            <div className={`${styles.iconBox} ${styles.ml}`}><Package size={28} /></div>
            <div className={`${styles.iconBox} ${styles.shopee}`}><ShoppingBag size={28} /></div>
            <div className={`${styles.iconBox} ${styles.amazon}`}><ShoppingCart size={28} /></div>
            <div className={`${styles.iconBox} ${styles.tag}`}><Tag size={24} /></div>
            <div className={`${styles.iconBox} ${styles.coin}`}><Coins size={24} /></div>
            <div className={`${styles.iconBox} ${styles.coupon}`}><Ticket size={24} /></div>
            <div className={`${styles.iconBox} ${styles.gift}`}><Gift size={24} /></div>
            <div className={`${styles.iconBox} ${styles.party}`}><PartyPopper size={24} /></div>
          </div>

          <Image 
            src="/assets/mascote perfil png  (2).png" 
            alt="Mascote promotodahoraBR" 
            width={350} 
            height={350} 
            className={styles.mascotImage}
            priority
          />
        </div>
      </div>
    </section>
  );
}

