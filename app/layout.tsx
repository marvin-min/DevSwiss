import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevSwiss - 开发者瑞士军刀',
  description: 'DevSwiss - 一个功能强大的工具集合，就像瑞士军刀一样，为开发者提供多种实用工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              🛠️ DevSwiss
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
