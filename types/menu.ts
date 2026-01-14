export interface MenuItem {
  id: string
  nameAr: string
  nameEn: string
  description?: string
  prices: PriceOption[]
  image?: string
  categoryId: string
  isAvailable: boolean
  order: number
}

export interface PriceOption {
  label: string
  price: number
}

export interface Category {
  id: string
  nameAr: string
  nameEn: string
  image?: string
  order: number
  isActive: boolean
}

export interface SiteSettings {
  logo: string
  restaurantNameAr: string
  restaurantNameEn: string
  heroImage: string
  serviceCharge: number
  currency: string
  phone: string
  address: string
  workingHours: string
}

export interface SavedItem {
  item: MenuItem
  selectedPrice: PriceOption
  quantity: number
}
