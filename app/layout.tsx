import { Metadata } from 'next';
import { ReactNode } from 'react';
import "./globals.css";
import { metadata as siteMetadata } from './metadata';

export const metadata: Metadata = siteMetadata;

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="ko">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "RealEstateAgent",
                            "name": "자이 에이스 부동산",
                            "image": "https://your-domain.com/logo.png",
                            "description": "용인시 수지구 부동산 전문 중개업소",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "고기로 89 상가A동 102호",
                                "addressLocality": "용인시 수지구",
                                "addressRegion": "경기도",
                                "postalCode": "16866",
                                "addressCountry": "KR"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": "37.34624063672886",
                                "longitude": "127.08822977631557"
                            },
                            "telephone": "031-276-7771",
                            "openingHours": "Mo-Sa 09:00-18:00",
                            "url": "https://your-domain.com"
                        })
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}