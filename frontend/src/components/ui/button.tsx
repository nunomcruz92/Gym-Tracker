import { FC } from 'react';

export const Button: FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button className="btn" onClick={onClick}>
    {children}
  </button>
);
