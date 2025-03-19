import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// 데이터 타입 정의
interface Property {
  articleno?: number
  articlename: string // 아파트 이름
  realestatetypename: string // 주택 유형 (아파트, 오피스텔, 단독주택 등)
  tradetypename: string // 거래 유형(매매, 전세 등)
  floorinfo: string // 층 정보
  dealorwarrantprc: string // 거래 가격
  direction: string // 방향(동, 서, 남, 북 등)
  articleconfirmymd: string // 거래 완료 날짜
  articlefeaturedesc:string // 아파트 특징 설명
  buildingname:string // 아파트 이름(동)
  realtorname:string // 매물 담당자 이름
  cppcarticleurl:string // 아파트 사진 URL
  created_at: string // 생성 날짜
  isPopular?: boolean   // 인기 아파트 여부
}

// GET 메서드
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('real_estate_articles')
      .select('*')
      .eq('isPopular', true)
    
    if (error) throw error

    // 데이터 구조 변환
    const transformedData = data.map((article: any) => ({
      id: article.articleno,
      title: article.articlename,
      description: article.articlefeaturedsc || '',
      price: parseInt(article.dealorwarrantprc.replace(/[^0-9]/g, '')) || 0,
      location: article.areaname,
      type: article.realestatetypename,
      name: article.buildingname,
      features: JSON.stringify([
        `${article.area1}㎡`,
        article.direction,
        article.floorinfo
      ]),
      isPopular: true
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST 메서드
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('properties')
      .insert([body])
      .select()
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}

// PUT 메서드
export async function PUT(request: Request) {
  try {
    const { id } = await request.json()
    const property: Property = await request.json()
    
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE 메서드
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}