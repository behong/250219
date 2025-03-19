"use client"; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Home } from 'lucide-react';

import { Property } from '@/types/property';

type RealEstateArticle = Property;

export default function Articles() {
    const [articles, setArticles] = useState<RealEstateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from('real_estate_articles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setArticles(data || []);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-pink-950 transition-colors flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        홈으로 돌아가기
                    </Link>
                    <h1 className="text-2xl font-bold">부동산 매물 목록</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentArticles.map((article) => (
                        <div key={article.articleno} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold text-blue-600 mb-2">{article.articlename}</h2>
                            <div className="space-y-2">
                                <p className="text-gray-600">거래 유형: {article.tradetypename}</p>
                                <p className="text-gray-600">주택 유형: {article.realestatetypename}</p>
                                <p className="text-gray-600">가격: {article.dealorwarrantprc}</p>
                                <p className="text-gray-600">층수: {article.floorinfo}</p>
                                <p className="text-gray-600">방향: {article.direction}</p>
                                <p className="text-gray-600">공인중개사: {article.realtorname}</p>
                                <p className="text-gray-600">거래 완료일: {article.articleconfirmymd}</p>
                                <p className="text-gray-600">등록일: {new Date(article.created_at).toLocaleDateString('ko-KR')}</p>
                                {article.articlefeaturedesc && (
                                    <p className="text-gray-600">특징: {article.articlefeaturedesc}</p>
                                )}
                                <a
                                    href={article.cppcarticleurl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 text-blue-500 hover:underline"
                                >
                                    자세히 보기
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-4">
                    <button 
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        이전
                    </button>
                    <span>페이지 {currentPage} / {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        다음
                    </button>
                </div>
            </div>
    );
}