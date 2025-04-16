"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  LucideIcon,
  MapPin,
  Phone,
  Search,
  ThumbsUp
} from "lucide-react"
import Link from 'next/link'; // Import Link from Next.js
import React, { useCallback, useEffect, useRef, useState } from "react"
import './styles.css'; // Ensure this path is correct 


interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

import { Property } from '@/types/property'

const features: Feature[] = [
  {
    icon: Building2,
    title: "프리미엄 매물",
    description: "엄선된 고품격 아파트와 주택을 제공합니다."
  },
  {
    icon: Clock,
    title: "신속한 응대",
    description: "24시간 이내 빠른 상담과 매물 안내를 약속합니다."
  },
  {
    icon: ThumbsUp,
    title: "전문가 상담",
    description: "다년간 경력 공인중개사가 책임집니다."
  }
]

export default function Home() {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);  
  const [loading, setLoading] = useState(true);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(3); // 슬라이드당 아이템 수 상태 추가
  const totalSlides = Math.ceil(properties.length / itemsPerSlide);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // 터치 스와이프 기능 추가
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // 화면 너비에 따라 슬라이드당 아이템 수 조정
      if (window.innerWidth < 640) { // 모바일
        setItemsPerSlide(2);
      } else if (window.innerWidth < 1024) { // 태블릿
        setItemsPerSlide(2);
      } else { // 데스크탑
        setItemsPerSlide(3);
      }
    };

    // 초기 로드 시 실행
    handleResize();

    // 화면 크기 변경 시 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('real_estate_articles')
          .select('*')
          .eq('isPopular', true);

        if (error) {
          console.error('Error fetching properties:', error);
          setProperties([]);
        } else {
          setProperties(data || []);
        }
      } catch (error) {
          console.error('Failed to fetch properties:', error);
          setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [])

  const scrollToSlide = useCallback((index: number) => {
    if (slideContainerRef.current) {
      const slideWidth = slideContainerRef.current.offsetWidth;
      slideContainerRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % totalSlides;
    setCurrentSlide(next);
    scrollToSlide(next);
  }, [currentSlide, totalSlides, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    setCurrentSlide(prev);
    scrollToSlide(prev);
  }, [currentSlide, totalSlides, scrollToSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // 주소 복사 버튼 클릭 핸들러
  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('경기도 용인시 수지구 고기로 89 상가A동 102호')
      .then(() => {
        toast({
          description: "주소가 복사되었습니다",
          variant: "success",
          duration: 3000,
        })
      })
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden" aria-label="메인 소개">
          <div className="absolute inset-0 bg-black/5 -z-10" />
          <div className="max-w-6xl mx-auto text-center">
            <h1 itemProp="name" className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
              자이 에이스 부동산과 함께<br />
              당신의 보금자리를 찾아보세요
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              다년간 경력의 부동산 전문가들이 최적의 매물을 추천해드립니다
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="tel:031-276-7771">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                  지금 바로 상담받기 <Phone className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link href="/articles">
                <Button size="lg" className="bg-black hover:bg-pink-950">
                  매물 보기 <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-1 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                자이에이스 부동산만의 특별함
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-pink-50">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 mb-3 text-black" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50" aria-label="추천 매물">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                추천 매물
              </span>
            </h2>
            <div className={`relative ${!loading ? 'fade-in visible' : ''}`}>
              <div 
                ref={slideContainerRef}
                className="overflow-x-hidden snap-x snap-mandatory scrollbar-hide slide-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="flex gap-6 transition-transform duration-500">
                  {properties.map((property, index) => {
                    // 현재 슬라이드 인덱스를 기준으로 각 카드의 상태 결정
                    const itemIndex = Math.floor(index / itemsPerSlide);
                    let slideStatus = '';
                    if (itemIndex === currentSlide) {
                      slideStatus = 'active';
                    } else if (itemIndex === (currentSlide - 1 + totalSlides) % totalSlides) {
                      slideStatus = 'prev';
                    } else if (itemIndex === (currentSlide + 1) % totalSlides) {
                      slideStatus = 'next';
                    } else {
                      slideStatus = 'far';
                    }
                    
                    return (
                    <div key={property.articleno} itemScope itemType="https://schema.org/Apartment" className={`snap-start shrink-0 w-1/2 sm:w-1/2 md:w-[calc(33.333%-16px)] pt-4 slide-item ${slideStatus}`}>
                      <meta itemProp="name" content={property.articlename} />
                      <meta itemProp="description" content={property.articlefeaturedesc} />
                      <meta itemProp="price" content={property.dealorwarrantprc} />
                      <a href={`tel:031-276-7771`} className="block h-full cursor-pointer">
                        <Card className={`relative border-2 h-full property-card flex flex-col ${property.isPopular ? 'border-black' : 'border-transparent'} hover:border-pink-600 hover:scale-105 transition-all cursor-pointer`}>
                          {property.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm z-10 whitespace-nowrap shadow-sm">
                              인기 매물
                            </div>
                          )}
                          <CardHeader className="flex-shrink-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl mb-2">{property.articlename}</CardTitle>
                                <div className="text-sm text-slate-500">{property.realestatetypename}</div>
                                <div className="text-sm text-slate-500">
                                  {property.floorinfo}층 
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-slate-800">{property.dealorwarrantprc}</span>
                                <div className="text-sm text-slate-500">{property.tradetypename}</div>
                                <div className="text-sm text-slate-500">
                                  {property.direction} 
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col justify-between">
                            <div className="text-slate-600 mb-4">
                              <p className="line-clamp-2 min-h-[40px]">{property.articlefeaturedesc || '상세 정보는 전화 문의 바랍니다'}</p>
                            </div>
                            <div className="flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>전화 상담하기</span>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </div>
                  )})}
                </div>
              </div>
              
              {/* Navigation Buttons - Desktop */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-pink-50 transition-colors hidden md:flex items-center justify-center z-10"
              >
                <ChevronLeft className="h-6 w-6 text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-pink-50 transition-colors hidden md:flex items-center justify-center z-10"
              >
                <ChevronRight className="h-6 w-6 text-black" />
              </button>
              
              {/* Navigation Buttons - Mobile */}
              <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-2 md:hidden z-10">
                <button
                  onClick={prevSlide}
                  className="bg-white p-3 rounded-full shadow-lg hover:bg-pink-50 transition-colors z-10 slide-btn flex items-center justify-center"
                >
                  <ChevronLeft className="h-5 w-5 text-black" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white p-3 rounded-full shadow-lg hover:bg-pink-50 transition-colors z-10 slide-btn flex items-center justify-center"
                >
                  <ChevronRight className="h-5 w-5 text-black" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-3 mt-6">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentSlide(i);
                      scrollToSlide(i);
                    }}
                    className={`w-3 h-3 md:w-2 md:h-2 rounded-full transition-colors slide-indicator ${
                      i === currentSlide ? 'bg-black active' : 'bg-pink-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-white" aria-label="연락처 및 위치">
          <div itemScope itemType="https://schema.org/RealEstateAgent" className="max-w-6xl mx-auto text-center">
            <meta itemProp="name" content="자이 에이스 부동산" />
            <meta itemProp="telephone" content="031-276-7771" />
            <meta itemProp="address" content="경기도 용인시 수지구 고기로 89 상가A동 102호" />
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                찾아오시는 길
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              편리한 방법으로 연락주시면 친절하게 상담해드리겠습니다
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info Card */}
              <Card className="border-2 border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-pink-600">연락처 안내</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <Phone className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-slate-500">대표번호</span>
                      <a href="tel:031-276-7771" className="text-xl font-bold hover:text-pink-600 transition-colors">
                        031-276-7771
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <Phone className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-slate-500">휴대전화</span>
                      <a href="tel:010-9802-7775" className="text-xl font-bold hover:text-pink-600 transition-colors">
                        010-9802-7775
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="border-2 border-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/50 backdrop-blur cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-pink-600">오시는 길</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors group">
                        <div className="bg-white p-3 rounded-full shadow-md">
                          <MapPin className="h-6 w-6 text-pink-600" />
                        </div>
                        <div className="flex flex-col items-start flex-1">
                          <span className="text-sm text-slate-500">주소</span>
                          <span className="text-lg font-medium">경기도 용인시 수지구 고기로 89</span>
                          <span className="text-lg font-medium">상가A동 102호</span>
                        </div>
                        <button
                          onClick={handleCopyAddress}
                          className="bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-5 w-5 text-pink-600" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-500 text-center mt-4">
                        클릭하시면 지도가 표시됩니다
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 h-[90vh]">
                  <DialogHeader className="p-4 pb-0 absolute top-0 left-0 right-0 bg-white z-10">
                    <DialogTitle>오시는 길</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-full">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3795.4728219993385!2d127.08822977631557!3d37.34624063672886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b59f7c73fa89b%3A0x29db3fd44098731f!2z64-Z7LKc7J6Q7J20IOyVhO2MjO2KuCDsg4HqsIA!5e1!3m2!1sko!2skr!4v1739952515523!5m2!1sko!2skr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="py-8 px-4 bg-black text-white">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <p>© 2024 자이 에이스 부동산. All rights reserved.</p>
            <Link href="/admin" className="text-pink-400 hover:text-pink-300 transition-colors">
              관리자 페이지
            </Link>
          </div>
        </footer>

      </div>
    </>
  )
}
