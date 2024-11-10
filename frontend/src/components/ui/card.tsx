import { FC } from 'react';

export const Card: FC = ({ children }) => (
  <div className="card">{children}</div>
);

export const CardHeader: FC = ({ children }) => (
  <div className="card-header">{children}</div>
);

export const CardTitle: FC = ({ children }) => (
  <h2 className="card-title">{children}</h2>
);

export const CardDescription: FC = ({ children }) => (
  <p className="card-description">{children}</p>
);

export const CardContent: FC = ({ children }) => (
  <div className="card-content">{children}</div>
);
