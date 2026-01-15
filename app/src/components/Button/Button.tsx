import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
};

const Button = ({
  children,
  loading = false,
  disabled = false,
  icon,
  onClick,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button disabled={isDisabled} onClick={onClick}>
      {icon && !loading && <span>{icon}</span>}

      <span>{children}</span>
    </button>
  );
};

export default Button;
