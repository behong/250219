"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Home } from 'lucide-react';

import { Property } from '@/types/property';

type RealEstateArticle = Property;

export default function AdminPage() {
    const [articles, setArticles] = useState<RealEstateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const togglePopular = async (articleno: number) => {
        const article = articles.find(a => a.articleno === articleno);
        if (!article) return;

        const newIsPopular = !article.isPopular;

        try {
            const { error } = await supabase
                .from('real_estate_articles')
                .update({ isPopular: newIsPopular })
                .eq('articleno', articleno);

            if (error) {
                console.error('Error updating popular status:', error);
                return;
            }

            setArticles(prevArticles =>
                prevArticles.map(a =>
                    a.articleno === articleno
                        ? { ...a, isPopular: newIsPopular }
                        : a
                )
            );
        } catch (error) {
            console.error('Error updating popular status:', error);
        }
    };

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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (password === '0914') { // 실제 구현시에는 더 안전한 비밀번호 검증 로직을 사용해야 합니다
                            setIsAuthenticated(true);
                            setError('');
                        } else {
                            setError('비밀번호가 올바르지 않습니다.');
                        }
                    }}>
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="관리자 비밀번호를 입력하세요"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredArticles = [...articles]
        .filter(article => {
            const matchesSearch = article.articlename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               article.realtorname.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' ||
                                (filterType === 'popular' && article.isPopular) ||
                                (filterType === 'apartment' && article.realestatetypename === '아파트') ||
                                (filterType === 'officetel' && article.realestatetypename === '오피스텔');
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (a.isPopular && !b.isPopular) return -1;
            if (!a.isPopular && b.isPopular) return 1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    const currentArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

    return (
            <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-pink-950 transition-colors flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            홈으로 돌아가기
                        </Link>
                        <h1 className="text-2xl font-bold">관리자 페이지</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="매물명 또는 공인중개사 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-lg flex-1"
                        />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border rounded-lg">
                            <option value="all">전체 매물</option>
                            <option value="popular">인기 매물</option>
                            <option value="apartment">아파트</option>
                            <option value="officetel">오피스텔</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentArticles.map((article) => (
                        <div key={article.articleno} className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow relative overflow-hidden">
                            {article.isPopular && (
                                <div className="absolute top-0 right-0 bg-yellow-400 text-xs px-2 py-1 rounded-bl-lg">
                                    인기매물
                                </div>
                            )}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-blue-600 mb-1">{article.articlename}</h2>
                                    <p className="text-sm text-gray-500">{article.realestatetypename} · {article.tradetypename}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={article.isPopular}
                                    onChange={() => article.articleno && togglePopular(article.articleno)}
                                    className="h-5 w-5 text-blue-600 mt-1"
                                />
                            </div>
                            <div className="mb-3">
                                <p className="text-lg font-bold text-gray-900">{article.dealorwarrantprc}</p>
                                <p className="text-sm text-gray-600">{article.floorinfo} · {article.direction}</p>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <span>{article.realtorname}</span>
                                <span>{new Date(article.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setExpandedArticle(expandedArticle === article.articleno && article.articleno ? null : article.articleno || null)}
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    {expandedArticle === article.articleno ? '접기' : '더보기'}
                                </button>
                                <a
                                    href={article.cppcarticleurl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    자세히 보기
                                </a>
                            </div>
                            {expandedArticle === article.articleno && (
                                <div className="mt-3 pt-3 border-t text-sm space-y-2">
                                    <p className="text-gray-600">거래 완료일: {article.articleconfirmymd}</p>
                                    {article.articlefeaturedesc && (
                                        <p className="text-gray-600">특징: {article.articlefeaturedesc}</p>
                                    )}
                                </div>
                            )}
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