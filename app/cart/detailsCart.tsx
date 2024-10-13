import { Button } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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

interface DetailsCartProps {
  Details: RestaurantGroup[];
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  onTotalChange: (totalAmount: number, totalItems: number) => void;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  onItemCheck: (restaurantIndex: number, itemIndex: number, isChecked: boolean) => void;
}

interface CartItemWithChecked extends CartItem {
  checked: boolean;
}

interface RestaurantGroupWithChecked extends RestaurantGroup {
  items: CartItemWithChecked[];
  checked: boolean;
}

export default function DetailsCart({ Details, updateQuantity, removeItem, onTotalChange, selectAll, setSelectAll, onItemCheck }: DetailsCartProps) {
  const [checkedItems, setCheckedItems] = useState<RestaurantGroupWithChecked[]>(() =>
    Details.map(group => ({
      ...group,
      checked: false,
      items: group.items.map(item => ({ ...item, checked: false }))
    }))
  );

  useEffect(() => {
    setCheckedItems(
      Details.map(group => ({
        ...group,
        checked: group.checked || false,
        items: group.items.map(item => ({ ...item, checked: item.checked || false }))
      }))
    );
  }, [Details]);

  useEffect(() => {
    console.log('checkedItems changed:', checkedItems);
  }, [checkedItems]);

  const handleCheckRestaurant = (index: number) => {
    console.log('handleCheckRestaurant called', index);
    setCheckedItems(prev => {
      const newItems = [...prev];
      const newCheckedState = !newItems[index].checked;
      newItems[index] = {
        ...newItems[index],
        checked: newCheckedState,
        items: newItems[index].items.map(item => ({
          ...item,
          checked: newCheckedState
        }))
      };
      return newItems;
    });
  };

  const handleCheckItem = (restaurantIndex: number, itemIndex: number) => {
    console.log('handleCheckItem called', restaurantIndex, itemIndex);
    const newCheckedState = !checkedItems[restaurantIndex].items[itemIndex].checked;
    onItemCheck(restaurantIndex, itemIndex, newCheckedState);
    setCheckedItems(prev => {
      const newItems = [...prev];
      newItems[restaurantIndex] = {
        ...newItems[restaurantIndex],
        items: newItems[restaurantIndex].items.map((item, idx) =>
          idx === itemIndex ? { ...item, checked: newCheckedState } : item
        ),
        checked: newItems[restaurantIndex].items.every((item, idx) => 
          idx === itemIndex ? newCheckedState : item.checked
        )
      };
      return newItems;
    });
  };

  const calculateTotal = React.useCallback(() => {
    return checkedItems.reduce((total, restaurant) => 
      total + restaurant.items.reduce((restaurantTotal, item) => 
        item.checked ? restaurantTotal + item.menu_items.price * item.quantity : restaurantTotal, 0
      ), 0
    );
  }, [checkedItems]);

  useEffect(() => {
    const totalAmount = calculateTotal();
    const totalItems = checkedItems.reduce((total, restaurant) => 
      total + restaurant.items.filter(item => item.checked).length, 0
    );
    onTotalChange(totalAmount, totalItems);
  }, [checkedItems, calculateTotal, onTotalChange]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCheckedItems(prev => prev.map(restaurant => ({
      ...restaurant,
      checked: newSelectAll,
      items: restaurant.items.map(item => ({ ...item, checked: newSelectAll }))
    })));
  };

  return (
    <>
      {checkedItems.map((restaurant, index) => (
        <div key={index} className="w-full flex flex-col bg-white rounded-md">
          <div className="flex flex-row my-7 ml-8 items-center gap-3">
            <input 
              id={`restaurant-checkbox-${index}`} 
              type="checkbox" 
              checked={restaurant.checked}
              onChange={() => handleCheckRestaurant(index)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800" 
            />
            <span className="text-base font-normal">{restaurant.name}</span>
            {restaurant.quandoitac && (
              <div className="bg-beamin p-1 rounded-md">
                <span className="text-sm font-normal text-white">Quán đối tác</span>
              </div>
            )}
          </div>
          <div className="w-full border-t border-b border-solid border-gray-600 py-3">
            {/* <div className="w-full grid grid-cols-12 border-b border-solid border-x-gray-300 py-2">
              <div className="pl-8 col-span-4 flex items-center flex-row gap-5">
                <input 
                  id="select-all-checkbox" 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={checkedItems.every(restaurant => restaurant.checked && restaurant.items.every(item => item.checked))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800" 
                />
                <span className="text-base font-normal">Món Ăn</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-base font-bold">Đơn giá</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-base font-bold">Số lượng</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-base font-bold">Số tiền</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <span className="text-base font-bold">Thao tác</span>
              </div>
            </div> */}
            {restaurant.items.map((item, itemIndex) => (
              <div key={itemIndex} className={`w-full grid grid-cols-12 ${itemIndex !== restaurant.items.length - 1 ? 'border-b border-solid border-x-gray-300' : ''}`}>
                <div className="pl-8 col-span-4 flex items-center flex-row gap-3">
                  <input 
                    id={`item-checkbox-${index}-${itemIndex}`} 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => handleCheckItem(index, itemIndex)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800" 
                  />
                  <div className="relative h-36 w-36">
                    <Image layout="fill" objectFit="cover" src={item.menu_items.image_url} alt={item.menu_items.name} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-base">{item.menu_items.name}</span>
                    <span className="text-sm text-gray-600">{item.menu_items.description}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  ₫{item.menu_items.price.toLocaleString('vi-VN')}
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  <input
                    type="number"
                    id={`quantity-${index}-${itemIndex}`}
                    className="w-16 text-center border border-gray-300 rounded"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  ₫{(item.menu_items.price * item.quantity).toLocaleString('vi-VN')}
                </div>
                <div className="col-span-2 flex items-center justify-center flex-row gap-3">
                  <span className="hover:text-red-600 cursor-pointer" onClick={() => removeItem(item.id)}>Xóa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
