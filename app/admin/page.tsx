"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface Property {
  id: string
  type: string
  name: string
  price: string
  features: string
  isPopular: boolean
}

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [newProperty, setNewProperty] = useState({
    type: "",
    name: "",
    price: "",
    features: "",
    isPopular: false
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    const response = await fetch("/api/properties")
    const data = await response.json()
    setProperties(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newProperty,
        features: newProperty.features.split("\n")
      }),
    })
    fetchProperties()
    setNewProperty({
      type: "",
      name: "",
      price: "",
      features: "",
      isPopular: false
    })
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/properties/${id}`, {
      method: "DELETE",
    })
    fetchProperties()
  }

  return (
    
    <div className="container mx-auto py-10">
    <h1 className="text-4xl font-bold mb-8">매물 관리</h1>
    
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>새 매물 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">매물 제목</Label>
            <Input
              id="title"
              value={newProperty.title}
              onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
              placeholder="모던 아파트"
            />
          </div>
          <div>
            <Label htmlFor="description">매물 설명</Label>
            <Textarea
              id="description"
              value={newProperty.description}
              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
              placeholder="도심에 위치한 모던한 아파트입니다."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="price">가격</Label>
            <Input
              id="price"
              type="number"
              value={newProperty.price}
              onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })}
              placeholder="300000000"
            />
          </div>
          <div>
            <Label htmlFor="location">위치</Label>
            <Input
              id="location"
              value={newProperty.location}
              onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
              placeholder="서울 강남구"
            />
          </div>
          <div>
            <Label htmlFor="image_url">이미지 URL</Label>
            <Input
              id="image_url"
              value={newProperty.image_url}
              onChange={(e) => setNewProperty({ ...newProperty, image_url: e.target.value })}
              placeholder="https://example.com/images/apartment1.jpg"
            />
          </div>
          <div>
            <Label htmlFor="features">특성</Label>
            <Textarea
              id="features"
              value={newProperty.features}
              onChange={(e) => setNewProperty({ ...newProperty, features: e.target.value })}
              placeholder="특성을 입력하세요"
              rows={4}
            />
          </div>
          <Button type="submit">등록</Button>
        </form>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>설명:</strong> {property.description}</p>
              <p><strong>가격:</strong> {property.price}원</p>
              <p><strong>위치:</strong> {property.location}</p>
              {property.image_url && <img src={property.image_url} alt={property.title} className="w-full h-auto" />}
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(property.id!)}
              >
                삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  )
}