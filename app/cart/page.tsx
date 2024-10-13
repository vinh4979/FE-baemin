'use client'

import { useState, useEffect } from 'react';
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import DetailsCart from "./detailsCart";
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  menu_items: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    description: string;
    restaurants: {
      id: number;
      name: string;
    };
  };
  quantity: number;
  checked: boolean;
}

interface RestaurantGroup {
  name: string;
  quandoitac: boolean;
  items: CartItem[];
  checked: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<RestaurantGroup[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.sub) {
      setUserId(user.sub);
      fetchCartItems(user.sub);
    } else {
      message.error('Vui lòng đăng nhập để xem giỏ hàng');
    }
  }, []);

  const fetchCartItems = async (userId: number | null) => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/cart/${userId}`);
      if (response.ok) {
        const data: CartItem[] = await response.json();
        const groupedData = groupCartItemsByRestaurant(data.map(item => ({ ...item, checked: false })));
        setCartItems(groupedData.map(group => ({ ...group, checked: false })));
      } else {
        message.error('Không thể lấy dữ liệu giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      message.error('Đã xảy ra lỗi khi lấy dữ liệu giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const groupCartItemsByRestaurant = (items: CartItem[]): RestaurantGroup[] => {
    const groupedItems: { [key: string]: RestaurantGroup } = {};

    items.forEach(item => {
      const restaurantName = item.menu_items.restaurants.name;
      if (!groupedItems[restaurantName]) {
        groupedItems[restaurantName] = {
          name: restaurantName,
          quandoitac: true, // Assuming all restaurants are partners
          items: [],
          checked: false // Add this line
        };
      }
      groupedItems[restaurantName].items.push(item);
    });

    return Object.values(groupedItems);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/cart/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity }),
      });

      if (response.ok) {
        message.success('Cập nhật số lượng thành công');
        fetchCartItems(userId);
      } else {
        message.error('Không thể cập nhật số lượng');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lưng:', error);
      message.error('Đã xảy ra lỗi khi cập nhật số lượng');
    }
  };

  const removeItem = async (id: number) => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/cart/remove/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        fetchCartItems(userId);
      } else {
        message.error('Không thể xóa sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      message.error('Đã xảy ra lỗi khi xóa sản phẩm');
    }
  };

  const handleTotalChange = (amount: number, items: number) => {
    setTotalAmount(amount);
    setTotalItems(items);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(prevItems => 
      prevItems.map(restaurant => ({
        ...restaurant,
        checked: newSelectAll,
        items: restaurant.items.map(item => ({ ...item, checked: newSelectAll }))
      }))
    );
  };

  const handleCancelSelectedItems = async () => {
    const selectedItemIds = cartItems.flatMap(restaurant => 
      restaurant.items.filter(item => item.checked).map(item => item.id)
    );

    if (selectedItemIds.length === 0) {
      message.info('Vui lòng chọn sản phẩm để hủy');
      return;
    }

    console.log('Selected items:', selectedItemIds);

    try {
      const response = await fetch('http://localhost:8080/cart/remove-multiple', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItemIds }),
      });

      if (response.ok) {
        message.success('Đã hủy các sản phẩm đã chọn');
        fetchCartItems(userId);
        setSelectAll(false);
      } else {
        message.error('Không thể hủy sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi hủy sản phẩm:', error);
      message.error('Đã xảy ra lỗi khi hủy sản phẩm');
    }
  };

  const handleItemCheck = (restaurantIndex: number, itemIndex: number, isChecked: boolean) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      newItems[restaurantIndex].items[itemIndex].checked = isChecked;
      newItems[restaurantIndex].checked = newItems[restaurantIndex].items.every(item => item.checked);
      return newItems;
    });
  };

  const handleCheckout = () => {
    const selectedMenuIds = cartItems.flatMap(restaurant => 
      restaurant.items
        .filter(item => item.checked)
        .map(item => item.menu_items.id)
    );
    const encodedMenuIds = encodeURIComponent(JSON.stringify(selectedMenuIds));
    router.push(`/checkout?menuIds=${encodedMenuIds}`);
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
            Giỏ hàng
          </div>
        </div>
        <div className="w-1/2 h-full flex   items-center gap-3">
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span>Đang tải...</span>
        </div>
      ) : userId ? (
        <div className="mt-4 px-16 flex flex-col gap-4  pb-16 rounded-md">
          <div className="w-full h-16 bg-white grid grid-cols-12">
            <div className="pl-8 col-span-4 flex items-center flex-row gap-5">
              <input 
                id="select-all-checkbox" 
                type="checkbox" 
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800" 
              />
              <span className="text-base font-normal">Món Ăn</span>
            </div>
            <div className="col-span-2 flex items-center justify-center flex-row gap-3">
              <span className="text-base font-normal text-gray-600">Đ��n giá</span>
            </div>
            <div className="col-span-2 flex items-center justify-center flex-row gap-3">
              <span className="text-base font-normal text-gray-600">Số lưng</span>
            </div>
            <div className="col-span-2 flex items-center justify-center flex-row gap-3">
              <span className="text-base font-normal text-gray-600">Số tiền</span>
            </div>
            <div className="col-span-2 flex items-center justify-center flex-row gap-3">
              <span className="text-base font-normal text-gray-600">Thao tác</span>
            </div>
          </div>
          <DetailsCart 
            Details={cartItems} 
            updateQuantity={updateQuantity} 
            removeItem={removeItem} 
            onTotalChange={handleTotalChange}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            onItemCheck={handleItemCheck}
          />
          <div className=" flex flex-row fixed bottom-0  w-[90.6%]  mr-16  h-16 bg-white items-center  " >
            <div className="flex flex-row gap-2 w-1/2 h-full items-center ml-10">
              <div className="cursor-pointer hover:text-red-600" onClick={handleCancelSelectedItems}>Hủy</div>
              <div> Quán Đã chọn: </div>
              <div> {cartItems.filter(restaurant => restaurant.items.some(item => item.checked)).map(restaurant => restaurant.name).join(', ')}</div>
            </div>
            <div className="flex flex-row gap-2 w-1/2 h-full items-center justify-end pr-2"> 
              <div className=""> Tổng thanh toán ({totalItems} Sản phẩm):
              </div>
              <div className="text-red-600" >₫{totalAmount.toLocaleString('vi-VN')} </div>
              <div>
                <Button 
                  onClick={handleCheckout}
                  style={{'background':'#3AC5C9',color:'white'}}  
                  className="bg-beamin text-white w-40 h-10 rounded-md hover:brightness-105"
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <span>Vui lòng đăng nhập để xem giỏ hàng</span>
        </div>
      )}
    </>
  )
}
