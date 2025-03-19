import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET 메서드
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('real_estate_articles')
      .select('*')
      .eq('isPopular', true)
    if (error) throw error
    // 데이터를 Property 인터페이스에 맞게 반환
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}