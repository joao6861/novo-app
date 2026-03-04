"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const BANNERS = [
    {
        title: "Performance Sem Limites",
        subtitle: "A maior variedade de peças para o seu projeto turbo ou aspirado.",
        cta: "Ver Performance",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop",
        link: "/shop?category=performance",
    },
    {
        title: "Ferrari Challenge Elite",
        subtitle: "Alta performance, tecnologia e estética para máquinas de pista.",
        cta: "Ver Catálogo",
        image: "/banners/ferrari-challenge/track.png",
        link: "/shop?category=performance",
    },
    {
        title: "Ronco Esportivo Inox",
        subtitle: "Ponteiras e sistemas de exaustão de alta qualidade.",
        cta: "Ver Escapamentos",
        image: "https://images.unsplash.com/photo-1621259182978-f09e5e2ca1ff?q=80&w=2000&auto=format&fit=crop",
        link: "/shop?category=escapamento",
    },
];

export function BannerCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {BANNERS.map((banner, index) => (
                    <CarouselItem key={index}>
                        <div className="relative h-[400px] w-full lg:h-[600px] overflow-hidden">
                            <Image
                                src={banner.image}
                                alt={banner.title}
                                fill
                                className="object-cover brightness-50"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 md:px-12">
                                    <div className="max-w-2xl space-y-6">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-7xl animate-in slide-in-from-left duration-700">
                                            {banner.title.split(" ").map((word, i) => (
                                                <span key={i} className={i % 2 !== 0 ? "text-primary italic" : ""}>{word} </span>
                                            ))}
                                        </h2>
                                        <p className="text-lg text-white/70 md:text-2xl animate-in slide-in-from-left duration-700 delay-200">
                                            {banner.subtitle}
                                        </p>
                                        <div className="flex gap-4 pt-4 animate-in slide-in-from-left duration-700 delay-300">
                                            <Link href={banner.link}>
                                                <Button className="h-12 px-8 bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                                    {banner.cta}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-primary hover:text-black hidden md:flex" />
            <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-primary hover:text-black hidden md:flex" />
        </Carousel>
    );
}
