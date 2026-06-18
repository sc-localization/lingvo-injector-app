import { ReactNode } from 'react';
import styles from './Grid.module.scss';

interface GridProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

const Grid = ({
  children,
  columns = 2,
  gap = 20,
  className = '',
}: GridProps) => {
  const style = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div className={`${styles.grid} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Grid;
