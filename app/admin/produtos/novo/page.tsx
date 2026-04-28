import ProductForm from './ProductForm';
import styles from '../../admin.module.css';

export const metadata = {
  title: 'Novo Produto | Painel Admin',
};

export default function NovoProdutoPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Adicionar Novo Produto</h1>
      </div>
      <ProductForm />
    </div>
  );
}
