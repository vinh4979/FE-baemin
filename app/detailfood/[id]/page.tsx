'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { StarFilled, StarOutlined, EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined, DoubleRightOutlined, LikeFilled, ClockCircleTwoTone, DollarTwoTone, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Tabs, Input, message } from 'antd';
import Link from 'next/link';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone_number: string;
  opening_hours: string;
  is_partner: boolean;
  image_url: string;
  rating: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  categories: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function DetailFood({ params }: { params: { id: string } }) {
  const { id } = params;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [userId, setUserId] = useState<number>(1); // Tạm thời sử dụng ID cố định
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes, categoriesRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:8080/restaurants/${id}`),
          fetch(`http://localhost:8080/menu/restaurant/${id}`),
          fetch(`http://localhost:8080/categories/restaurant/${id}`),
          fetch(`http://localhost:8080/reviews/restaurant/${id}`)
        ]);

        const restaurantData = await restaurantRes.json();
        const menuData = await menuRes.json();
        const categoriesData = await categoriesRes.json();
        const reviewsData = await reviewsRes.json();

        setRestaurant(restaurantData);
        setMenuItems(menuData);
        setCategories(categoriesData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = async (menuItemId: number) => {
    const quantity = itemQuantities[menuItemId] || 0;
    if (quantity === 0) return;

    try {
      const response = await fetch('http://localhost:8080/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          menuItemId: menuItemId,
          quantity: quantity
        }),
      });

      if (response.ok) {
        console.log('Đã thêm món ăn vào giỏ hàng');
        setItemQuantities(prev => ({ ...prev, [menuItemId]: 0 }));
        message.success('Đã thêm món ăn vào giỏ hàng!');
      } else {
        console.error('Lỗi khi thêm vào giỏ hàng');
        message.error('Có lỗi xảy ra khi thêm món ăn vào giỏ hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const handleIncreaseQuantity = (itemId: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleDecreaseQuantity = (itemId: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
    }));
  };

  return (
    <div className="flex flex-col w-full h-auto">
      <div className="bg-white w-full h-80 flex">
        <div className="w-[45%] h-full py-4 px-10">
          <div className="w-full relative h-full" >
            <Image layout="fill" objectFit="cover" src={restaurant.image_url} alt={restaurant.name}></Image>
          </div>
        </div>
        <div className=" w-[55%] h-full relative">
          <div className="absolute top-0 left-0 px-8 py-4">
            <span className="text-[13px] text-[#187CAA]">
              <Link href="/">Home</Link> <DoubleRightOutlined className="text-[10px]" /> 
              <Link href="/">TP.HCM</Link> <DoubleRightOutlined className="text-[10px]" /> 
              <Link href={`/detailfood/${restaurant.id}`}>{restaurant.name}</Link>
            </span>
            <div className="flex flex-row text-[11px] justify-start items-center mt-3">
              <div className="bg-beamin text-white p-1 mr-2 cursor-pointer tracking-wider flex gap-1">
                <LikeFilled />
                <span>Yêu thích</span>
              </div>
              <span className="text-[#959595]">QUÁN ĂN - <Link href="" className="text-[#0288D1]">Chi nhánh</Link></span>
            </div>
            <div className="text-[22px] font-bold mt-2">{restaurant.name}</div>
            <div className="text-[13px] mt-1">{restaurant.address}</div>
            <div className="flex flex-row text-[14px] gap-2 justify-start items-center">
              <ol className="flex flex-row text-[#FFC107] gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.floor(parseFloat(restaurant.rating)) ? 
                    <StarFilled key={star} /> : 
                    <StarOutlined key={star} />
                ))}
              </ol>
              <p className="bg-[#FFC107] py-[2px] px-1 text-white rounded-md">999+</p>
              <span>đánh giá trên Baemin</span>
            </div>
            <div className="flex flex-row gap-4 justify-start items-center my-1 text-[15px]">
              <div className="flex flex-row gap-1 text-[#6CC942] justify-start items-center">
                <div className="w-2 h-2 bg-[#6CC942] rounded-full"></div>
                <span>Mở cửa</span>
              </div>
              <div className="flex flex-row gap-1 justify-start items-center">
                <ClockCircleTwoTone twoToneColor={"#3AC5C9"} />
                <span>{restaurant.opening_hours}</span>
              </div>
            </div>
            <div className="flex flex-row gap-1 justify-start items-center text-[#959595] text-[15px]">
              <DollarTwoTone twoToneColor={"#c0c0c0"} className="text-[16px]" />
              <span> 99.000 - 399.000</span>
            </div>
          </div>

          <div className="w-full flex flex-col absolute bottom-0 left-0 px-8 mb-4 text-[#959595] text-[13px]">
            <div className="border-t-[1px]"></div>
            <div className="flex flex-row gap-4 justify-start items-center py-[10px]">
              <div className="flex flex-col ">
                <span>PHÍ DỊCH VỤ</span>
                <span className="text-beamin font-bold text-[14px]">0.8% Phí dịch vụ</span>
              </div>
              <div className="border-l border-solid h-6"></div>
              <div className="flex flex-col">
                <span>DỊCH VỤ BỞI</span>
                <span className="text-beamin font-bold text-[14px]">Baemin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="py-[13px] px-[26px] font-bold text-beamin text-[14px]">THỰC ĐƠN</div>
        <div className="w-full flex flex-row gap-3">
          <div className="w-[20%] bg-white p-5">
            <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`mt-2 px-1 w-fit cursor-pointer ${selectedCategory === category.id ? 'bg-beamin text-white' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[50%] h-auto bg-white py-3 flex flex-col px-4">
            <div className="w-full mb-5">
              <Input 
                addonBefore={<SearchOutlined />} 
                placeholder="Tìm kiếm món ăn" 
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>
            <div className="flex flex-col w-full pl-1 gap-3">
              {(selectedCategory ? categories.filter(c => c.id === selectedCategory) : categories).map((category) => {
                const filteredItems = menuItems
                  .filter((item) => item.categories.id === category.id)
                  .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

                if (filteredItems.length === 0) return null;

                return (
                  <div key={category.id} className="flex flex-col w-full gap-3 border-b">
                    <div className="font-medium">{category.name}</div>
                    {filteredItems.map((item) => (
                      <div key={item.id} className="flex flex-row items-center">
                        <div className="w-[15%] relative h-16">
                          <Image layout="fill" objectFit="cover" src={item.image_url} alt={item.name}></Image>
                        </div>
                        <div className="w-[50%] flex flex-col gap-1 px-2">
                          <span className="font-bold text-[#464646]">{item.name}</span>
                          <span className="text-wrap text-sm text-[#464646]">{item.description}</span>
                        </div>
                        <div className="w-[15%] flex justify-center items-center">
                          <span className="text-[#0288d1] font-bold text-base">{parseInt(item.price).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="w-[20%] flex justify-center items-center">
                          <button onClick={() => handleDecreaseQuantity(item.id)} className="px-2 py-1 bg-gray-200 rounded-l">-</button>
                          <span className="px-4 py-1 bg-gray-100">{itemQuantities[item.id] || 0}</span>
                          <button onClick={() => handleIncreaseQuantity(item.id)} className="px-2 py-1 bg-gray-200 rounded-r">+</button>
                        </div>
                        <div className="w-[10%] flex justify-center items-center">
                          <button 
                            className="h-8 px-3 rounded-md flex justify-center items-center bg-beamin text-white font-bold cursor-pointer hover:brightness-110"
                            onClick={() => handleAddToCart(item.id)}
                            disabled={!itemQuantities[item.id]}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-[30%] bg-white p-4">
            <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
            <div className="reviews-container">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.users.avatar ? (
                        <Image src={review.users.avatar} alt={review.users.username} width={40} height={40} />
                      ) : (
                        review.users.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="review-info">
                      <p className="review-username">{review.users.username}</p>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarFilled 
                            key={star} 
                            className={star <= review.rating ? "star-yellow" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-date">
                    {new Date(review.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}