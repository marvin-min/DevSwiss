import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '个人工具包',
  description: '一个包含多种实用工具的个人工具集合',
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
              🧰 个人工具包
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
