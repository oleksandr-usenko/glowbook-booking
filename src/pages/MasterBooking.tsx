import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useServices } from '@/hooks/use-services'
import { Service } from '@/types/service'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'

export function MasterBooking() {
  const { id } = useParams<{ id: string }>()
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, error } = useServices(id!)

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load services</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  // API returns array directly
  const services = data || []

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Master Booking</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Available Services</h2>

          {services.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground">No services available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {service.duration} min
                    </span>
                    <span className="text-lg font-semibold">
                      {service.currency} {(service.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleServiceClick(service)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Glowbook Booking System</p>
        </div>
      </footer>

      <BookingDialog
        masterId={id!}
        service={selectedService}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
