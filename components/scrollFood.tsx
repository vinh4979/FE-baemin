'use client'
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { BhuTuka_Expanded_One } from "next/font/google";
import { title } from "process";
import React, { useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Restaurant {
    id: number;
    name: string;
    address: string;
    image_url: string | null;
    rating: number | null;
    is_partner: boolean | null;
    href: string;
  }
  
  interface ScrollFoodProps {
    items: Restaurant[];
    title: string;
  }

export default function ScrollBar({ items, title }: ScrollFoodProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNavigate = () => {
          router.push('/detailfood');
      };
    const containerRef = React.useRef<HTMLDivElement>(null);
    const handleNext = () => {
        if (containerRef.current) {
            if(items.length-1>currentIndex) setCurrentIndex(currentIndex+1)
            containerRef.current.scrollBy({ left: 180, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (containerRef.current) {
            if(0<currentIndex) setCurrentIndex(currentIndex-1)
            containerRef.current.scrollBy({ left: -180, behavior: 'smooth' });
        }
    };

    const handleItemClick = (restaurantId: number) => {
        router.push(`/detailfood`);
    };

    return (
        <div className="w-full relative py-6">
            <h2 className="text-2xl font-bold mb-6 px-4">{title}</h2>
            <div className="relative">
              {currentIndex > 0 && (
                <button onClick={handlePrev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-beamin-50 text-beamin hover:text-white w-10 h-10 rounded-full shadow-md z-20 flex items-center justify-center transition duration-300">
                  <LeftOutlined />
                </button>
              )}
              <div ref={containerRef} className="scroll-container flex overflow-x-auto scrollbar-hide px-4 pb-6" style={{ scrollSnapType: 'x mandatory' }}>
                {items.map((item) => (
                  <Link href={item.href} key={item.id}>
                    <div 
                      className="flex-shrink-0 w-72 mr-6 bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg cursor-pointer" 
                      style={{ scrollSnapAlign: 'start' }}
                      onClick={() => handleItemClick(item.id)}
                    >
                      {item.image_url && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 truncate">{item.name}</h3>
                        <p className="text-gray-600 mb-2 text-sm truncate">{item.address}</p>
                        <div className="flex items-center justify-between">
                          {item.rating && (
                            <p className="text-yellow-500 font-medium">
                              <span className="text-lg">{Number(item.rating).toFixed(1)}</span>
                              <span className="text-sm ml-1">★</span>
                            </p>
                          )}
                          {item.is_partner && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">Đối tác</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {currentIndex < items.length - 1 && (
                <button onClick={handleNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-beamin-50 text-beamin hover:text-white w-10 h-10 rounded-full shadow-md z-20 flex items-center justify-center transition duration-300">
                  <RightOutlined />
                </button>
              )}
            </div>
          </div>
    )
}
