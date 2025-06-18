"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1400&q=80",
];

export default function ImageCarousel() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: { perView: 1 },
    created() {
      startAutoplay();
    },
    destroyed() {
      stopAutoplay();
    },
  });

  const startAutoplay = () => {
    stopAutoplay();
    timer.current = setInterval(() => {
      instanceRef.current?.next();
    }, 3000); // 3 seconds delay
  };

  const stopAutoplay = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  useEffect(() => {
    return () => {
      stopAutoplay();
    };
  }, []);

  return (
    <div className="p-4">
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl overflow-hidden cursor-pointer"
      >
        {images.map((src, idx) => (
          <div className="keen-slider__slide" key={idx}>
            <Card className="rounded-none border-none shadow-none">
              <CardContent className="p-0">
                <Image
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  width={1400}
                  height={600}
                  className="w-full h-[400px] object-cover"
                  priority
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
