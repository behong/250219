"use client"; // 클라이언트 컴포넌트로 마크

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import { ReactNode } from 'react';


// export const metadata: Metadata = {
//   title: "자이 에이스 부동산",
//   description: "최고의 매물을 추천합니다.",
// };

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

 
export default function Layout({ children, title }: LayoutProps) {
    return (
        <>
        <html>
            <Head>
                <title>{title || '기본 제목 - 자이 에이스 부동산'}</title> {/* title prop 사용 */}
            </Head>
            <body>{children}</body>
            </html>
        </>
    );
}
