import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const properties = await prisma.property.findMany()
    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const property = await prisma.property.create({
      data: {
        type: body.type,
        name: body.name,
        price: body.price,
        features: JSON.stringify(body.features),
        isPopular: body.isPopular
      }
    })
    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
} 