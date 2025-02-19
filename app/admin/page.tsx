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
              <Label htmlFor="type">매물 종류</Label>
              <Input
                id="type"
                value={newProperty.type}
                onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                placeholder="아파트, 오피스텔, 주택 등"
              />
            </div>
            <div>
              <Label htmlFor="name">매물명</Label>
              <Input
                id="name"
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                placeholder="자이 프리미엄"
              />
            </div>
            <div>
              <Label htmlFor="price">가격</Label>
              <Input
                id="price"
                value={newProperty.price}
                onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                placeholder="9억 8,000"
              />
            </div>
            <div>
              <Label htmlFor="features">특징 (줄바꿈으로 구분)</Label>
              <Textarea
                id="features"
                value={newProperty.features}
                onChange={(e) => setNewProperty({ ...newProperty, features: e.target.value })}
                placeholder="전용 84㎡&#10;남향 위치&#10;초역세권&#10;신축 아파트"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPopular"
                checked={newProperty.isPopular}
                onCheckedChange={(checked) => 
                  setNewProperty({ ...newProperty, isPopular: checked as boolean })
                }
              />
              <Label htmlFor="isPopular">인기 매물</Label>
            </div>
            <Button type="submit">등록</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>종류:</strong> {property.type}</p>
                <p><strong>가격:</strong> {property.price}만원</p>
                <p><strong>특징:</strong></p>
                <ul className="list-disc pl-5">
                  {JSON.parse(property.features).map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <p><strong>인기 매물:</strong> {property.isPopular ? "예" : "아니오"}</p>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(property.id)}
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