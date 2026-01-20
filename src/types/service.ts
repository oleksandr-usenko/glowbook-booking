export interface MediaItem {
  public_id: string
  fileName: string
  uri: string
  mimeType: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  currency: string
  duration: number
  timestamp?: string
  user_id: number
  media: MediaItem[]
}
