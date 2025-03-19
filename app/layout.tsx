import "./globals.css";
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "자이 에이스 부동산",
  description: "최고의 매물을 추천합니다.",
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}