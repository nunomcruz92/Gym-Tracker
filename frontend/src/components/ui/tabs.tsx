import { FC } from 'react';

export const Tabs: FC = ({ children }) => <div className="tabs">{children}</div>;

export const TabsList: FC = ({ children }) => <div className="tabs-list">{children}</div>;

export const TabsContent: FC = ({ children }) => <div className="tabs-content">{children}</div>;

export const TabsTrigger: FC<{ onClick?: () => void }> = ({ children, onClick }) => (
  <button className="tabs-trigger" onClick={onClick}>
    {children}
  </button>
);
