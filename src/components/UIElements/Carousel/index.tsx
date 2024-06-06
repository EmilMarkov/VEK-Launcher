import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/shadcn-ui/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn-ui/ui/carousel"
import ReactPlayer from 'react-player';


interface MediaCarouselProps {
  images?: string[];
  videos?: string[];
}

export function MediaCarousel({ images = [], videos = [] }: MediaCarouselProps) {
  const media = [...videos, ...images];

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (media.length === 0) return null;

  console.log(media)

  return (
    <div className="relative w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full p-10"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-full">
          {media.map((item, index) => (
            <CarouselItem key={index} className="w-full">
              <Card className="w-full bg-transparent shadow-none border-none">
                <CardContent className="flex items-center justify-center p-0 bg-transparent border-none">
                  {item.endsWith('.mp4') ? (
                    <ReactPlayer
                      url={item}
                      playing
                      loop
                      muted
                      controls
                      width="100%"
                      height="100%"
                      className="object-contain"
                    />
                  ) : (
                    <img src={item} alt={`Media item ${index + 1}`} className="w-full h-full max-h-[500px] object-contain" />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}
