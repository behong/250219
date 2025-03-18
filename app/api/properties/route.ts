import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// 데이터 타입 정의
interface Property {
  id?: number
  title: string
  description: string
  price: number
  location: string
  image_url?: string
}

// GET 메서드
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
    
    if (error) throw error

    return NextResponse.json(data)
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