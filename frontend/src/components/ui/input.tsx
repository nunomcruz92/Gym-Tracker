import { FC } from 'react';

export const Input: FC<{ placeholder: string }> = ({ placeholder }) => (
  <input className="input" placeholder={placeholder} />
);
