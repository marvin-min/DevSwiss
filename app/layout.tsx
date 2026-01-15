import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MongoDB 客户端',
  description: '简单的MongoDB Web客户端',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
