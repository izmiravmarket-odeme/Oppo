import type { ButtonHTMLAttributes } from 'react';

import * as Bem from '../utils/Bem';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

/** Primary UI component for user interaction */
export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={Bem.block('tox-button', [ 'naked' ])}
      {...props}
    >
      {children}
    </button>
  );
};
