'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountBookOutlined, CompassOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import DetailsCheckout from "./detailsCheckout";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  totalPrice: number;
}

interface Address {
  id: number;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export default function Checkout() {
    const searchParams = useSearchParams();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const menuIds = searchParams?.get('menuIds');
        if (menuIds) {
            const ids = JSON.parse(decodeURIComponent(menuIds)) as number[];
            fetchCartItemsData(ids).then(items => setMenuItems(items));
        }
    }, [searchParams]);

    const fetchCartItemsData = async (ids: number[]): Promise<MenuItem[]> => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.sub) {
                throw new Error('Người dùng chưa đăng nhập');
            }
            const response = await fetch(`http://localhost:8080/cart/${user.sub}`);
            if (!response.ok) {
                throw new Error('Không thể lấy dữ liệu giỏ hàng');
            }
            const cartItems = await response.json();
            return cartItems
                .filter((item: any) => ids.includes(item.menu_items.id))
                .map((item: any) => ({
                    id: item.menu_items.id,
                    name: item.menu_items.name,
                    description: item.menu_items.description,
                    price: Number(item.menu_items.price),
                    image_url: item.menu_items.image_url,
                    quantity: item.quantity,
                    totalPrice: Number(item.menu_items.price) * item.quantity
                }));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserAddresses = async (userId: number): Promise<Address[]> => {
        const response = await fetch(`http://localhost:8080/address/user/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user addresses');
        }
        return response.json();
    };

    const handleNavigate = () => {
        router.push('/statusorder');
    };

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (menuItems.length === 0) {
        return <div>Không có sản phẩm nào trong giỏ hàng</div>;
    }

    const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];

    const calculateTotal = (items: MenuItem[]) => {
      return items.reduce((total, item) => total + item.totalPrice, 0);
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        setMenuItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                    : item
            )
        );
    };

    return (
        <>
            <div className="flex flex-row w-full h-20 bg-white ">
                <div className="w-1/2 h-full flex flex-row  items-center gap-3">
                    <div className="ml-10 text-4xl  text-beamin font-bold" >
                        <ShoppingCartOutlined />
                    </div>
                    <div className="text-2xl  text-beamin ">
                        |
                    </div>
                    <div className="text-3xl  text-beamin font-bold">
                        Thanh Toán
                    </div>
                </div>
            </div>
            <div className="px-16 flex flex-col gap-3 ">
                <div className="w-full h-28 flex flex-col bg-white rounded-md pl-10 pt-5">
                    <div className="flex flex-row gap-1">
                        <div className="text-xl">
                            <svg version="1.1" viewBox="0 0 2048 2048" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#3AC5C9" transform="translate(1e3 353)" d="m0 0h48l30 3 28 5 32 8 29 10 27 12 23 12 24 15 18 13 14 11 11 10 8 7 21 21 7 8 13 16 13 18 14 22 12 22 11 23 11 29 8 28 6 28 4 29 2 33v12l-1 23-3 27-5 28-7 27-10 30-11 26-12 26-16 36-18 40-12 27-36 80-18 41-16 35-16 36-18 40-12 27-36 80-11 25-13 29-19 42-32 72-19 42-18 40-13 30-16 35-2 3-8-16-18-40-18-41-17-37-32-72-13-29-36-80-11-25-36-80-20-45-36-80-28-63-19-42-17-38-16-36-13-29-18-40-11-27-9-29-7-30-4-26-2-20v-55l3-28 5-28 7-28 11-32 11-25 13-25 13-21 12-17 10-13 12-14 12-13 16-16 8-7 14-12 18-13 15-10 15-9 18-10 28-13 28-10 25-7 28-6 31-4zm7 183-27 4-25 7-19 8-19 10-16 11-9-10 9-11 11-11 14-9 13-8 14-8 16-9 27-4 19-2 15v38l3 21 4 17 7 21 10 21 12 19 10 13 9 10 7 8 8 7 12 10 15 10 16 9 15 7 24 8 25 5 7 1 24 1 20-1 24-4 21-6 20-8 21-11 17-12 11-9 14-13 7-8 11-14 10-15 11-21 9-24 6-26 2-15v-39l-4-26-6-21-6-16-8-16-8-14-14-19-12-13-11-11-14-11-13-9-16-9-17-8-21-7-23-5-16-2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-beamin">Địa chỉ giao hàng</span>
                    </div>
                    <div className="pl-3 flex flex-row gap-5 items-center mb-3 mt-3">
                        <span className="font-bold" >Trần minh Thiện (+84) 344034531 </span>
                        <span>Địa chỉ: {defaultAddress?.address_line1}, {defaultAddress?.city}</span>
                        {defaultAddress?.is_default && <div className="border border-solid border-beamin p-1 text-xs text-beamin" > Mặc định  </div>}
                        <span className="ml-3 text-blue-600 text-sm cursor-pointer "> Thay đổi </span>
                    </div>
                </div>
                <div className="w-full bg-white rounded-md flex flex-col pt-5">
                    <DetailsCheckout items={menuItems} />
                    <div className="w-full border-t flex flex-col justify-end items-end pt-4 gap-4 pr-10">
                        <div className="flex justify-between w-[30%]">
                            <div className="text-sm text-gray-900">
                                Tổng tiền hàng
                            </div>
                            <div className="text-sm">
                                ₫{calculateTotal(menuItems).toLocaleString('vi-VN')}
                            </div>
                        </div>
                        <div className="flex justify-between w-[30%]">
                            <div className="text-sm text-gray-900">
                                Tổng thanh toán
                            </div>
                            <div className="text-2xl text-beamin">
                                ₫{calculateTotal(menuItems).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-t flex flex-row justify-between items-center pt-4 gap-4 mb-4">
                        <div className="w-[70%] ml-8">
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span className="text-blue-600 text-sm cursor-pointer">Điều khoản Baemin</span>
                        </div>
                        <div className="w-[30%] pl-48">
                            <button onClick={handleNavigate} className="p-1 bg-beamin text-white w-36 rounded-md h-10 hover:brightness-105">
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
