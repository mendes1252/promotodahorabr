import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import fs from 'fs';
import path from 'path';

export default async function Footer() {
  let whatsappLink = '#';
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (data.whatsappLink) {
        whatsappLink = data.whatsappLink;
      }
    }
  } catch (error) {
    console.error('Error loading settings for footer:', error);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <div className={styles.logoGroup}>
            <Image 
              src="/assets/image3.jpeg" 
              alt="Avatar promotodahoraBR" 
              width={40} 
              height={40} 
              className={styles.avatar}
            />
            <span className={styles.logoText}>
              promotodahoraBR
            </span>
          </div>
          <p className={styles.description}>
            Curadoria das melhores promoções da Amazon, Shopee e Mercado Livre para você economizar com facilidade.
          </p>
        </div>

        <div className={styles.linksSection}>
          <h3 className={styles.linksTitle}>Plataformas</h3>
          <ul className={styles.linksList}>
            <li><Link href="/amazon" className={styles.link}>Amazon</Link></li>
            <li><Link href="/shopee" className={styles.link}>Shopee</Link></li>
            <li><Link href="/mercado-livre" className={styles.link}>Mercado Livre</Link></li>
          </ul>
        </div>

        <div className={styles.vipSection}>
          <h3 className={styles.linksTitle}>Ofertas Exclusivas</h3>
          <p className={styles.vipText}>Não perca nenhuma promoção relâmpago! Entre no nosso grupo VIP.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.vipButton}>Acesse nosso grupo VIP</a>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} promotodahoraBR. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
