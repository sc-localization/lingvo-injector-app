import { ReactNode } from 'react';
import styles from './Panel.module.scss';

interface PanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

const Panel = ({ children, title, className = '' }: PanelProps) => {
  return (
    <section className={`${styles.panel} ${className}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </section>
  );
};

export default Panel;
