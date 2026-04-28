import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';
import { Package, LayoutDashboard, LogOut } from 'lucide-react';

export const metadata = {
  title: 'Painel Admin | promotodahoraBR',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.brand}>Admin</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/admin/produtos" className={styles.navLink}>
            <Package size={20} />
            Produtos
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userEmail}>{user.email}</div>
          <form action="/auth/signout" method="post">
            <button type="submit" className={styles.logoutButton}>
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
