import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

// 데이터 타입 정의
interface Property {
  id?: number
  title: string
  description: string
  price: number
  location: string
  image_url?: string
}

// GET: 모든 매물 조회
const getProperties = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase.from('properties').select('*')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
}

// POST: 매물 저장
const createProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const property: Property = req.body

  const { data, error } = await supabase.from('properties').insert([property]).select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json(data)
}

// PUT: 매물 수정
const updateProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const property: Property = req.body

  const { data, error } = await supabase.from('properties').update(property).eq('id', id).select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
}

// DELETE: 매물 삭제
const deleteProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(204).end()
}

// API 라우트 핸들러
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getProperties(req, res)
    case 'POST':
      return createProperty(req, res)
    case 'PUT':
      return updateProperty(req, res)
    case 'DELETE':
      return deleteProperty(req, res)
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
} 