'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Amazon', path: '/amazon' },
    { name: 'Shopee', path: '/shopee' },
    { name: 'Mercado Livre', path: '/mercado-livre' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Abrir menu">
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
          <Link href="/" className={styles.logoGroup}>
            <Image 
              src="/assets/image3.jpeg" 
              alt="Avatar promotodahoraBR" 
              width={32} 
              height={32} 
              className={styles.avatar}
            />
            <span className={styles.logoText}>
              promotodahoraBR
            </span>
          </Link>
        </div>

        <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>Menu</span>
            <button className={styles.closeBtn} onClick={toggleMenu}>&times;</button>
          </div>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {isOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
      </div>
    </nav>
  );
}
