import { Calendar, Image as ImageIcon } from 'lucide-react'
import { Service } from '@/types/service'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { SmartImage } from '@/components/smart-image'

interface ServiceCardProps {
  service: Service
  onBookClick: (service: Service) => void
}

function isValidImageUrl(url: string): boolean {
  // Filter out local file:// URIs and other invalid schemes
  return url.startsWith('http://') || url.startsWith('https://')
}

export function ServiceCard({ service, onBookClick }: ServiceCardProps) {
  const validImages = service.media?.filter(
    (item) => item.mimeType?.startsWith('image/') && isValidImageUrl(item.uri)
  ) || []

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Carousel */}
      {validImages.length === 0 && (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {validImages.length === 1 && (
        <div className="aspect-video relative bg-muted">
          <SmartImage
            src={validImages[0].uri}
            alt={validImages[0].fileName || service.name}
            className="w-full h-75 object-cover"
          />
        </div>
      )}

      {validImages.length > 1 && (
        <div className="relative bg-muted">
          <Carousel images={validImages}></Carousel>
          {/*<Carousel
            key={`service-carousel-${service.id}-${validImages.length}`}
            className="w-full"
          >
            <CarouselContent>
              {validImages.map((mediaItem, index) => (
                <CarouselItem key={mediaItem.public_id || index}>
                  <div className="aspect-video relative">
                    <SmartImage
                      src={mediaItem.uri}
                      alt={mediaItem.fileName || service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>*/}
        </div>
      )}

      {/* Service Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        {service.description && (
          <p className="text-muted-foreground mb-4">{service.description}</p>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {service.duration} min
          </span>
          <span className="text-lg font-semibold">
            {service.currency} {service.price}
          </span>
        </div>
        <Button className="w-full" onClick={() => onBookClick(service)}>
          <Calendar className="mr-2 h-4 w-4" />
          Book Now
        </Button>
      </div>
    </div>
  )
}
