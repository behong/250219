"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ChevronLeft,
  ChevronRight,
  CheckCircle2, 
  Building2, 
  Clock, 
  MapPin,
  Phone,
  Search,
  ThumbsUp,
  LucideIcon 
} from "lucide-react"
import './styles.css'; // Ensure this path is correct 
import Link from 'next/link'; // Import Link from Next.js


interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface Property {
  id?: number
  title: string
  description: string
  price: number
  location: string
  image_url?: string
  isPopular?: boolean 
  type?: string
  name?: string
  features: string
}

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = Math.ceil(properties.length / 3);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch('/api/properties');
      const data = await response.json();
      console.log(data); // Log the data to check its structure
      setProperties(data);
      setLoading(false);
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/5 -z-10" />
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
              자이 에이스 부동산과 함께<br />
              당신의 보금자리를 찾아보세요
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              다년간 경력의 부동산 전문가들이 최적의 매물을 추천해드립니다
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://new.land.naver.com/complexes/112792?ms=37.345878,127.090312,17&a=APT:ABYG:JGC:PRE&e=RETAIL&ad=true&articleNo=2508979071&realtorId=coding9741" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-black hover:bg-pink-950">
                  매물 보기 <Search className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="tel:031-276-7771">
                <Button size="lg" variant="outline" className="border-black text-black hover:bg-pink-50">
                  상담 문의 <Phone className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                자이 에이스 부동산만의 특별함
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
        <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                추천 매물
              </span>
                {/* 추천 매물 리스트로 이동하는 버튼 추가 */}
                <Link href="/articles" passHref>
                  <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    리스트 보기
                  </button>
                </Link>
            </h2>
            <div className={`relative ${!loading ? 'fade-in visible' : ''}`}>
              <div 
                ref={slideContainerRef}
                className="overflow-x-hidden snap-x snap-mandatory scrollbar-hide"
              >
                <div className="flex gap-6 transition-transform duration-500">
                  {properties.map((property) => (
                    <div key={property.id} className="snap-start shrink-0 w-full md:w-[calc(33.333%-16px)] pt-4">
                      <Card className={`relative border-2 h-full ${
                        property.isPopular ? 'border-black' : 'border-transparent'
                      } hover:border-pink-600 transition-colors`}>
                        {property.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-sm z-10 whitespace-nowrap shadow-sm">
                            인기 매물
                          </div>
                        )}
                        <CardHeader>
                          <div className="text-sm text-slate-500 mb-2">{property.type}</div>
                          <CardTitle className="text-xl">{property.title}</CardTitle>
                          <CardDescription>
                            <span className="text-2xl font-bold text-slate-800">
                              {Math.floor(property.price / 100000000)} 억
                            </span>
                            <span className="text-slate-600">원</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {property.features ? (
                              (() => {
                                try {
                                  const parsedFeatures = JSON.parse(property.features);
                                  if (Array.isArray(parsedFeatures)) {
                                    return parsedFeatures.map((feature: string, i: number) => (
                                      <li key={i} className="flex items-center text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-pink-600 mr-2" />
                                        {feature}
                                      </li>
                                    ));
                                  } else {
                                    return <li className="text-slate-600">특성이 잘못된 형식입니다.</li>; // Fallback for non-array
                                  }
                                } catch (error) {
                                  console.error("Error parsing features:", error);
                                  return <li className="text-slate-600">특성이 잘못되었습니다.</li>; // Fallback for parsing error
                                }
                              })()
                            ) : (
                              <li className="text-slate-600">특성이 없습니다.</li> // Fallback for undefined features
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white p-2 rounded-full shadow-lg hover:bg-pink-50 transition-colors hidden md:block"
              >
                <ChevronLeft className="h-6 w-6 text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white p-2 rounded-full shadow-lg hover:bg-pink-50 transition-colors hidden md:block"
              >
                <ChevronRight className="h-6 w-6 text-black" />
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentSlide(i);
                      scrollToSlide(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentSlide ? 'bg-black' : 'bg-pink-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 bg-pink-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              <span className="bg-gradient-to-r from-black to-pink-600 bg-clip-text text-transparent">
                지금 바로 상담받으세요
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              매물 상담부터 계약까지 원스톱으로 도와드립니다
            </p>
            <div className="flex gap-6 justify-center items-center flex-wrap">
              <Card className="border-2 border-pink-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-50 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-500">대표번호</span>
                        <span className="text-lg font-semibold">031-276-7771</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-50 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-500">휴대전화</span>
                        <span className="text-lg font-semibold">010-9802-7775</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="border-2 border-pink-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-50 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-black" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-slate-500">주소</span>
                          <span className="text-lg font-semibold">경기도 용인시 수지구 고기로 89 상가A동 102호</span>
                        </div>
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
            {/* <a href="/admin" className="text-pink-400 hover:text-pink-300">
              관리자 페이지
            </a> */}
          </div>
        </footer>

      </div>
    </>
  )
}
