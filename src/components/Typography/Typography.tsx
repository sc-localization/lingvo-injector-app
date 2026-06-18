import { ReactNode, ElementType } from 'react';
import styles from './Typography.module.scss';

interface TypographyProps {
  children: ReactNode;
  variant?:
    | 'body'
    | 'label'
    | 'value'
    | 'title'
    | 'subtitle'
    | 'status'
    | 'path';
  color?: 'default' | 'dim' | 'accent' | 'danger' | 'warning';
  className?: string;
  as?: ElementType;
}

const Typography = ({
  children,
  variant = 'body',
  color = 'default',
  className = '',
  as: Component = 'span',
}: TypographyProps) => {
  const finalClassName = `${styles[variant]} ${styles[color]} ${className}`;
  return <Component className={finalClassName}>{children}</Component>;
};

export default Typography;
