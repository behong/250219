"use client"; // 클라이언트 컴포넌트로 마크

import "./globals.css";
import Head from 'next/head';
import { ReactNode } from 'react';


// export const metadata: Metadata = {
//   title: "자이 에이스 부동산",
//   description: "최고의 매물을 추천합니다.",
// };

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <title>내 앱</title>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
};

export default Layout;
