"use client"; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust the path as necessary
import Layout from '../layout'; // Adjust the path as necessary

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
}

export default function Articles() {
    const [articles, setArticles] = useState<RealEstateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // 페이지당 항목 수

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('real_estate_articles')
                .select('*');

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setArticles(data);
            }
            setLoading(false);
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>; // Loading state
    }

    // 페이징 계산 커밋
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Layout title="부동산 매물 목록">
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
                <h1 className="text-2xl font-bold mb-4">부동산 매물 목록</h1>
                <ul className="space-y-4">
                    {currentArticles.map((article) => (
                        <li key={article.articleno} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold text-blue-600">{article.articlename.toLowerCase()}</h2>
                            <p className="text-gray-600">상태: {article.articlestatus}</p>
                            <p className="text-gray-600">유형: {article.realestatetypename}</p>
                            <p className="text-gray-600">가격: {article.dealorwarrantprc}</p>
                            <p className="text-gray-600">위치: {article.areaname}</p>
                            <p className="text-gray-600">면적: {article.area1}㎡</p>
                            <p className="text-gray-600">방향: {article.direction}</p>
                            <p className="text-gray-600">공인중개사: {article.realtorname}</p>
                            <a href={article.cppcarticurl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">자세히 보기</a>
                        </li>
                    ))}
                </ul>

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