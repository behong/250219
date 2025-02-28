"use client"; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import Layout from '../layout'; // Adjust the path as necessary
import Link from 'next/link'; // Import Link from Next.js

interface RealEstateArticle {
    articleno: number;
    articlename: string;
    articlestatus: string;
    realestatetypecode: string;
    realestatetypename: string;
    tradetypecode: string;
    tradetypename: string;
    floorinfo: string;
    dealorwarrantprc: string;
    areaname: string;
    area1: number;
    area2: number;
    direction: string;
    articleconfirmymd: string;
    articlefeaturedsc: string;
    buildingname: string;
    latitude: number;
    longitude: number;
    realtorname: string;
    cpname: string;
    cppcarticurl: string;
    created_at: string;
    isChecked?: boolean; // 체크박스 상태를 위한 필드 추가
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
                    isChecked: false, // 기본값 false
                }));
                setArticles(articlesWithCheckedState);
            }
            setLoading(false);
        };

        fetchArticles();
    }, []);

    const toggleCheck = (articleno: number) => {
        setArticles((prevArticles) =>
            prevArticles.map((article) =>
                article.articleno === articleno
                    ? { ...article, isChecked: !article.isChecked } // 체크 상태 토글
                    : article
            )
        );
    };

    if (loading) {
        return <div>로딩 중...</div>; // Loading state
    }

    // 페이징 계산
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
                <h1 className="text-2xl font-bold mb-4">부동산 매물 목록</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* 그리드 레이아웃 설정 */}
                    {currentArticles.map((article) => (
                        <div key={article.articleno} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={article.isChecked}
                                    onChange={() => toggleCheck(article.articleno)} // 체크박스 클릭 시 상태 변경
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-600">추천 매물 등록</span>
                                <h2 className="text-xl font-semibold text-blue-600 ml-2">{article.articlename.toLowerCase()}</h2>
                            </div>
                            <p className="text-gray-600">상태: {article.articlestatus}</p>
                            <p className="text-gray-600">유형: {article.realestatetypename}</p>
                            <p className="text-gray-600">가격: {article.dealorwarrantprc}</p>
                            <p className="text-gray-600">위치: {article.areaname}</p>
                            <p className="text-gray-600">면적: {article.area1}㎡</p>
                            <p className="text-gray-600">방향: {article.direction}</p>
                            <p className="text-gray-600">공인중개사: {article.realtorname}</p>
                            <a href={article.cppcarticurl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">자세히 보기</a>
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