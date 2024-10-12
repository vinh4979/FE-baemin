'use client';

import HeaderNav from "@/components/headerNav";
import ScrollBar from "@/components/scrollBar";
import ScrollFood from "@/components/scrollFood";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";

interface Category {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: Date | null;
    updated_at: Date | null;
}

interface Restaurant {
    id: number;
    name: string;
    address: string;
    image_url: string | null;
    rating: number | null;
    is_partner: boolean | null;
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/categories');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:8080/restaurants/random?count=10');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        fetchCategories();
        fetchRestaurants();
    }, []);

    const banneritems = [
        {
            id: '1',
            name: 'anh 1',
            url: '/images/map1.png',
        },
        {
            id: '2',
            name: 'anh 2',
            url: '/images/map2.png',
        },
        {
            id: '3',
            name: 'anh 32',
            url: '/images/map3.png',
        },
        {
            id: '3',
            name: 'anh 32',
            url: '/images/map4.png',
        }
    ]
    const TodayFood = {
        title: 'Hôm Nay ăn gì',
        items: [
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },
            {
                id: '1',
                name: ' Gà Ủ Muối Hoa Tiêu - Food',
                adrress: '4A Đường Số 71, P. Tân Quy, Quận 7, TP. HCM',
                img: '/food/ga1.jpg',
                kind: 'Quan An'
            },

        ]
    }
    return (
        <>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 pt-3 pl-8 pr-8  z-40">
                    <div className="flex flex-col fixed  bg-white w-64 rounded-2xl  pl-3 pt-2  pb-5 gap-3  ">
                        <span>Thực đơn </span>
                        {categories.map((category: Category) => (
                            <div key={category.id} className="flex flex-col gap-3 cursor-pointer hover:bg-slate-100">
                                <div className="flex flex-row items-center gap-1">
                                    <Image 
                                        src={category.image_url || '/images/default.png'} 
                                        width={30} 
                                        height={30} 
                                        alt={ category.name} 
                                    />
                                    <span>{category.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-9 w-full  pt-3 pr-8 gap-3 flex flex-col">
                    <ScrollBar items={banneritems} />
                    <ScrollFood items={restaurants} title="Nhà hàng ngẫu nhiên" />
                </div>
            </div>
        </>
    );
}
