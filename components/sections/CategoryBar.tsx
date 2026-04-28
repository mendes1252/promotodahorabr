'use client';
import { 
  Smartphone, Shirt, Home, Sparkles, BookOpen, BedDouble, HeartPulse, Baby, Wrench,
  Gamepad, Music, Camera, Utensils, Gift, Car, Coffee, Dumbbell, Glasses, Plane, Star, Tag, ShoppingBag, Watch
} from 'lucide-react';
import styles from './CategoryBar.module.css';

interface Category {
  id: string;
  label: string;
  iconName: string;
}

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={24} />,
  Shirt: <Shirt size={24} />,
  Home: <Home size={24} />,
  Sparkles: <Sparkles size={24} />,
  BookOpen: <BookOpen size={24} />,
  BedDouble: <BedDouble size={24} />,
  HeartPulse: <HeartPulse size={24} />,
  Baby: <Baby size={24} />,
  Wrench: <Wrench size={24} />,
  Gamepad: <Gamepad size={24} />,
  Music: <Music size={24} />,
  Camera: <Camera size={24} />,
  Utensils: <Utensils size={24} />,
  Gift: <Gift size={24} />,
  Car: <Car size={24} />,
  Coffee: <Coffee size={24} />,
  Dumbbell: <Dumbbell size={24} />,
  Glasses: <Glasses size={24} />,
  Plane: <Plane size={24} />,
  Star: <Star size={24} />,
  Tag: <Tag size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Watch: <Watch size={24} />
};

export default function CategoryBar({ categories, activeCategory, onSelectCategory }: CategoryBarProps) {
  // Se não vier nenhuma categoria (fallback), tenta usar um array vazio para não quebrar
  const catsToRender = categories && categories.length > 0 ? categories : [];

  return (
    <div className={styles.categoryBarWrapper}>
      <div className={styles.container}>
        <div className={styles.scrollArea}>
          {catsToRender.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryItem} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => onSelectCategory(activeCategory === cat.id ? null : cat.id)}
            >
              <div className={styles.iconCircle}>
                {ICON_MAP[cat.iconName] || <Tag size={24} />}
              </div>
              <span className={styles.label}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

