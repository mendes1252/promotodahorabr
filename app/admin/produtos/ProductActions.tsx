'use client';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

export default function ProductActions({ id }: { id: string }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin?edit=${id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este produto?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/delete-product?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert('Produto excluído com sucesso!');
        router.refresh();
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir.');
    }
  };

  return (
    <div className={styles.actionsCell}>
      <button className={styles.iconButton} title="Editar" onClick={handleEdit}>
        <Pencil size={18} />
      </button>
      <button className={`${styles.iconButton} ${styles.delete}`} title="Excluir" onClick={handleDelete}>
        <Trash2 size={18} />
      </button>
    </div>
  );
}
