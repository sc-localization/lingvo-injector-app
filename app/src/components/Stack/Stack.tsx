import { ReactNode, ElementType } from 'react';
import styles from './Stack.module.scss';

interface StackProps {
  children: ReactNode;
  gap?: number;
  direction?: 'column' | 'row';
  className?: string;
  as?: ElementType;
}

const Stack = ({
  children,
  gap = 10,
  direction = 'column',
  className = '',
  as: Component = 'div',
}: StackProps) => {
  const style = {
    gap: `${gap}px`,
    flexDirection: direction,
  };

  return (
    <Component className={`${styles.stack} ${className}`} style={style}>
      {children}
    </Component>
  );
};

export default Stack;
