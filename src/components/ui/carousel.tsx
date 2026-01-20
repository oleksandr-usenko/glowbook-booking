import useEmblaCarousel from 'embla-carousel-react'
import {MediaItem} from "@/types/service.ts";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {useCallback, useEffect, useState} from "react";

export function Carousel({ images }: { images: MediaItem[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        skipSnaps: false,
        dragFree: false,
    })

    const [selectedIndex, setSelectedIndex] = useState(0)
    const goToPrev = () => emblaApi?.goToPrev()
    const goToNext = () => emblaApi?.goToNext()
    const leftDisabled = selectedIndex === 0;
    const rightDisabled = selectedIndex === images.length - 1;


    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        onSelect()
        emblaApi.on('select', onSelect)

        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi, onSelect])

    return (
        <div className="embla relative">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {images.map(image => (
                        <div className="embla__slide" key={image.public_id}>
                            <div className="embla__slide__inner">
                                <img
                                    src={image.uri}
                                    alt="carousel image"
                                    className="embla__slide__img"
                                />
                                {selectedIndex}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                disabled={leftDisabled}
                type="button"
                className={`absolute top-1/2 -translate-y-1/2 left-4 bg-amber-100 text-gray-800 p-1 border border-solid border-gray-700 rounded-full cursor-pointer hover:opacity-80 ${leftDisabled ? 'opacity-10' : 'opacity-50'}`}
                onClick={goToPrev}
            >
                <ArrowLeft />
            </button>
            <button
                disabled={rightDisabled}
                type="button"
                className={`absolute top-1/2 right-4 -translate-y-1/2 bg-amber-100 text-gray-800 p-1 border border-solid border-gray-700 rounded-full cursor-pointer hover:opacity-80 ${rightDisabled ? 'opacity-10' : 'opacity-50'}`}
                onClick={goToNext}
            >
                <ArrowRight />
            </button>
        </div>
    )
}