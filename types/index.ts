export interface RingProduct {
  id: string
  name: string
  series: string
  badge?: string
  finish: "black" | "gold" | "silver" | "blue" | "gunmetal" | "rose-gold"
  finishName: string
  description: string
  price: number
  originalPrice?: number
  image: string
  availableSizes: number[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  finishName: string
  finish: "black" | "gold" | "silver" | "gunmetal" | "blue" | "rose-gold"
  size: number
  price: number
  quantity: number
  image: string
}

export interface Testimonial {
  id: string
  rating: number
  title: string
  quote: string
  author: string
  initials: string
  location: string
  model: string
}

export interface SizeChartItem {
  size: number
  diameterMm: number
  circumferenceMm: number
}

export interface Salon {
  id: string
  city: string
  name: string
  tag: string
  hours: string
  address: string
  details: string[]
  mapLabel: string
  availability: string[]
  lat: number
  lng: number
}
