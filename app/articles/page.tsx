"use client"; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Home, Filter, ArrowDownUp } from 'lucide-react';

import { Property } from '@/types/property';

type RealEstateArticle = Property;

export default function Articles() {
    const [articles, setArticles] = useState<RealEstateArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [filterType, setFilterType] = useState('all'); // 필터 타입 (all, 전세, 매매, 건물별)
    const [sortOrder, setSortOrder] = useState('newest'); // 정렬 순서 (newest, priceAsc, priceDesc)

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

    // 가격 문자열에서 숫자만 추출하는 함수
    const extractPriceNumber = (priceStr: string): number => {
        // 숫자만 추출 (억, 만, 천만, 쉼표 등 제거)
        const numStr = priceStr.replace(/[^0-9]/g, '');
        return numStr ? parseInt(numStr) : Infinity;
    };

    // 전세 매물 찾기
    const jeonseArticles = articles.filter(article => 
        article.tradetypename.includes('전세')
    );

    // 매매 매물 찾기
    const maemaeArticles = articles.filter(article => 
        article.tradetypename.includes('매매')
    );

    // 전세 최저가 매물
    const cheapestJeonse = jeonseArticles.length > 0 ? 
        [...jeonseArticles].sort((a, b) => 
            extractPriceNumber(a.dealorwarrantprc) - extractPriceNumber(b.dealorwarrantprc)
        )[0] : null;

    // 매매 최저가 매물
    const cheapestMaemae = maemaeArticles.length > 0 ? 
        [...maemaeArticles].sort((a, b) => 
            extractPriceNumber(a.dealorwarrantprc) - extractPriceNumber(b.dealorwarrantprc)
        )[0] : null;

    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 필터링 및 정렬 적용
    const filteredArticles = [...articles].filter(article => {
        if (filterType === 'all') return true;
        if (filterType === '건물별') return true; // 건물별 보기는 필터링 단계에서는 모든 매물 포함
        return article.tradetypename.includes(filterType);
    });

    // 정렬 적용
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortOrder === 'priceAsc') {
            return extractPriceNumber(a.dealorwarrantprc) - extractPriceNumber(b.dealorwarrantprc);
        } else if (sortOrder === 'priceDesc') {
            return extractPriceNumber(b.dealorwarrantprc) - extractPriceNumber(a.dealorwarrantprc);
        }
        return 0;
    });

    // 페이지네이션 로직 - 건물별 보기일 때는 그룹 수 기준, 아닐 때는 매물 수 기준
    const totalPages = filterType === '건물별' ?
        Math.ceil(Object.keys(sortedArticles.reduce((groups, article) => {
            groups[article.articlename] = true;
            return groups;
        }, {} as Record<string, boolean>)).length / itemsPerPage) :
        Math.ceil(sortedArticles.length / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentArticles = sortedArticles.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-pink-950 transition-colors flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        홈으로 돌아가기
                    </Link>
                    <h1 className="text-2xl font-bold">부동산 매물 목록</h1>
                </div>
                
                {/* 필터링 및 정렬 컨트롤 */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select 
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setCurrentPage(1); // 필터 변경 시 첫 페이지로
                            }}
                            className="border-none focus:ring-0 text-sm"
                        >
                            <option value="all">모든 매물</option>
                            <option value="전세">전세 매물</option>
                            <option value="매매">매매 매물</option>
                            <option value="건물별">건물별 보기</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
                        <ArrowDownUp className="h-4 w-4 text-gray-500" />
                        <select 
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                setCurrentPage(1); // 정렬 변경 시 첫 페이지로
                            }}
                            className="border-none focus:ring-0 text-sm"
                        >
                            <option value="newest">최신순</option>
                            <option value="priceAsc">가격 낮은순</option>
                            <option value="priceDesc">가격 높은순</option>
                        </select>
                    </div>
                </div>
                
                {/* 최저가 매물 하이라이트 섹션 */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">최저가 매물 하이라이트</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cheapestJeonse && (
                            <div className="border-2 border-blue-500 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{cheapestJeonse.articlename}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">전세 최저가</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-600 font-bold text-lg">{cheapestJeonse.dealorwarrantprc}</p>
                                    <p className="text-gray-600">주택 유형: {cheapestJeonse.realestatetypename}</p>
                                    <p className="text-gray-600">층수: {cheapestJeonse.floorinfo}</p>
                                    <p className="text-gray-600">방향: {cheapestJeonse.direction}</p>
                                    <p className="text-gray-600">공인중개사: {cheapestJeonse.realtorname}</p>
                                </div>
                            </div>
                        )}
                        
                        {cheapestMaemae && (
                            <div className="border-2 border-green-500 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-green-600 mb-2">{cheapestMaemae.articlename}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">매매 최저가</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-600 font-bold text-lg">{cheapestMaemae.dealorwarrantprc}</p>
                                    <p className="text-gray-600">주택 유형: {cheapestMaemae.realestatetypename}</p>
                                    <p className="text-gray-600">층수: {cheapestMaemae.floorinfo}</p>
                                    <p className="text-gray-600">방향: {cheapestMaemae.direction}</p>
                                    <p className="text-gray-600">공인중개사: {cheapestMaemae.realtorname}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <h2 className="text-xl font-bold mb-4">전체 매물 목록 ({filteredArticles.length}개)</h2>
                
                {filterType === '건물별' ? (
                    // 건물별 그룹화 뷰
                    <div className="space-y-8">
                        {(() => {
                            // articlename으로 그룹화
                            const groupedByArticleName = sortedArticles.reduce((groups, article) => {
                                const key = article.articlename;
                                if (!groups[key]) {
                                    groups[key] = [];
                                }
                                groups[key].push(article);
                                return groups;
                            }, {} as Record<string, RealEstateArticle[]>);
                            
                            // 페이지네이션 적용을 위해 현재 페이지에 표시할 그룹만 선택
                            const groupNames = Object.keys(groupedByArticleName);
                            const currentGroupNames = groupNames.slice(startIndex, startIndex + itemsPerPage);
                            
                            return currentGroupNames.map(groupName => (
                                <div key={groupName} className="border-t-2 border-pink-200 pt-4">
                                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                                        {groupName} <span className="text-sm font-normal text-gray-600">({groupedByArticleName[groupName].length}개 매물)</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {groupedByArticleName[groupName].map((article) => (
                                            <div key={article.articleno} className={`border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow ${article.tradetypename.includes('전세') ? 'border-l-4 border-l-blue-400' : article.tradetypename.includes('매매') ? 'border-l-4 border-l-green-400' : ''}`}>
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ));
                        })()} 
                    </div>
                ) : (
                    // 기존 그리드 뷰
                    <>
                        // 기존 그리드 뷰
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {currentArticles.map((article) => (
                                <div key={article.articleno} className={`border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow ${article.tradetypename.includes('전세') ? 'border-l-4 border-l-blue-400' : article.tradetypename.includes('매매') ? 'border-l-4 border-l-green-400' : ''}`}>
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
                                    </div>
                                </div>
                            ))}
                        </div><div className="flex justify-between mt-4">
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
                    </>
                )}
        </div>
    );
}