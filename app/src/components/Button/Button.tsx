import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
  onClick: () => void;
};

const Button = ({
  children,
  loading = false,
  disabled = false,
  icon,
  variant = 'default',
  onClick,
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const className = `${styles.btn}${variant === 'danger' ? ` ${styles.danger}` : ''}`;

  return (
    <button className={className} disabled={isDisabled} onClick={onClick}>
      <div className={styles.inner} />
      <div className={styles.hatch} />
      {icon && !loading && <span>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export default Button;
