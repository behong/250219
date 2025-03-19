"use client"; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import Layout from '../layout'; // Adjust the path as necessary
import Link from 'next/link';
import { Home } from 'lucide-react';

interface RealEstateArticle {
    articleno?: number;
    articlename: string;
    realestatetypename: string;
    tradetypename: string;
    floorinfo: string;
    dealorwarrantprc: string;
    direction: string;
    articleconfirmymd: string;
    articlefeaturedesc: string;
    buildingname: string;
    realtorname: string;
    cppcarticleurl: string;
    created_at: string;
    isPopular?: boolean;
    isChecked?: boolean;
}

export default function Articles() {
    const [articles, setArticles] = useState<RealEstateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // 페이지당 항목 수

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('real_estate_articles')
                .select('*');

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                // 체크박스 상태 초기화
                const articlesWithCheckedState = data.map((article: RealEstateArticle) => ({
                    ...article,
                    isChecked: article.isPopular || false // isPopular 값을 체크박스 상태로 사용
                }));
                setArticles(articlesWithCheckedState);
            }
            setLoading(false);
        };

        fetchArticles();
    }, []);

    const toggleCheck = async (articleno: number) => {
        try {
            const article = articles.find(a => a.articleno === articleno);
            if (!article) return;

            const newCheckedState = !article.isChecked;

            // Update Supabase
            const { error } = await supabase
                .from('real_estate_articles')
                .update({ isPopular: newCheckedState })
                .eq('articleno', articleno);

            if (error) throw error;

            // Update local state
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.articleno === articleno
                        ? { ...article, isChecked: newCheckedState }
                        : article
                )
            );
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    if (loading) {
        return <div>로딩 중...</div>; // Loading state
    }

    // 페이징 계산
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    // 체크된 매물을 상단으로 정렬
    const sortedArticles = [...articles].sort((a, b) => {
        if (a.isChecked === b.isChecked) return 0;
        return a.isChecked ? -1 : 1;
    });
    const currentArticles = sortedArticles.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Layout>
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
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold text-blue-600">{article.articlename}</h2>
                                <input
                                    type="checkbox"
                                    checked={article.isChecked}
                                    onChange={() => article.articleno && toggleCheck(article.articleno)}
                                    className="h-5 w-5 text-blue-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">거래 유형: {article.tradetypename}</p>
                                <p className="text-gray-600">주택 유형: {article.realestatetypename}</p>
                                <p className="text-gray-600">가격: {article.dealorwarrantprc}</p>
                                <p className="text-gray-600">층수: {article.floorinfo}</p>
                                <p className="text-gray-600">방향: {article.direction}</p>
                                <p className="text-gray-600">공인중개사: {article.realtorname}</p>
                                <p className="text-gray-600">거래 완료일: {article.articleconfirmymd}</p>
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

                {/* 페이징 버튼 */}
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
        </Layout>
    );
}