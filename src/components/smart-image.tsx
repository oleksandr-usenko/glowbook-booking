import { useState, useEffect } from 'react'

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: React.ReactNode
}

export function SmartImage({ src, alt, fallback, ...props }: SmartImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const convertHeicIfNeeded = async () => {
      // Check if the image is HEIC format
      const isHeic = /\.(heic|heif)$/i.test(src) || src.toLowerCase().includes('heic')

      if (!isHeic) {
        setImageSrc(src)
        return
      }

      try {
        setIsLoading(true)

        // Dynamically import heic2any only when needed
        const { default: heic2any } = await import('heic2any')

        // Fetch the HEIC image
        const response = await fetch(src)
        const blob = await response.blob()

        // Convert HEIC to JPEG
        const convertedBlob = await heic2any({
          blob,
          toType: 'image/jpeg',
          quality: 0.9,
        })

        // Create object URL for the converted image
        const convertedBlobSingle = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
        const url = URL.createObjectURL(convertedBlobSingle)
        setImageSrc(url)

        // Cleanup function
        return () => URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to convert HEIC image:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    convertHeicIfNeeded()
  }, [src])

  const handleError = () => {
    setHasError(true)
  }

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <img src={imageSrc} alt={alt} onError={handleError} {...props} />
}
