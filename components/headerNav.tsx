'use client'
import { Button, Select, Dropdown, Menu, Avatar } from "antd";
import { SearchProps } from "antd/es/input";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { HomeOutlined, SearchOutlined, SolutionOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

interface user {
    id : number, 
    username: string, 
    email: string, 
    password: string, 
    phone_number: string, 
    avatar: string, 
    latitude: number, 
    longitude: number, 
    user_type: string, 
    created_at: Date, 
    updated_at: Date
}

export default function HeaderNav() {
    const router = useRouter();
    const [user, setUser] = useState<user | null>(null);
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData)); // Chuyển đổi chuỗi JSON thành đối tượng
                console.log("local", userData);
            } catch (error) {
                console.error("Lỗi khi phân tích JSON:", error);
                // Xử lý lỗi, ví dụ: xóa dữ liệu không hợp lệ khỏi localStorage
                localStorage.removeItem('user');
            }
        }
    }, []);

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        router.push('/sreach')

    };
    const navigation =()=>{
        router.push('/dashboard')
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Thêm logic chuyển hướng về trang đăng nhập nếu cần
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<UserOutlined />} onClick={() => router.push('/profile')}>
                Hồ sơ
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="w-full h-fix bg-white flex flex-row fixed  py-3 gap-4 justify-items-center	justify-center z-50	">
            <div onClick={navigation} className="flex-none w-fit h-full ml-10 cursor-pointer ">
                <svg xmlns="http://www.w3.org/2000/svg" width="131" height="50" viewBox="0 0 131 27">
                    <g fill="#3AC5C9" fillRule="evenodd">
                        <path d="M45 0v27h18v-5.21H50.054v-5.685h8.837v-5.21h-8.837V5.21H63V0zM90 0v5.21h6.948v16.58H90V27h19v-5.21h-6.95V5.21H109V0zM11.86 11.132H5.046V5.21h6.64c1.895 0 2.824 1.162 2.824 2.961 0 1.8-.752 2.96-2.648 2.96m-.177 10.659H5.045V15.869h6.816c1.896 0 2.648 1.161 2.648 2.96 0 1.8-.929 2.96-2.825 2.96M19 8.645v-.947C19 3.434 15.77 0 11.76 0H0v27H11.76C15.769 27 19 23.566 19 19.303v-.947A6.287 6.287 0 0 0 16.74 13.5 6.285 6.285 0 0 0 19 8.644M119.319 0l6.25 16.536c.078.206.375.148.375-.072V0H131v27h-6.32l-6.247-16.526c-.079-.208-.379-.15-.379.073V27H113V0h6.319zM80.506 10.465l-1.702 6.255c-.647 2.379-3.96 2.378-4.606 0l-1.706-6.272c-.059-.216-.372-.173-.372.052V27H67V0h6.282l3.033 11.008c.053.192.32.192.372 0L79.72 0H86v27h-5.118V10.517c0-.228-.317-.271-.376-.052M28.572 16.715l2.742-11.59c.048-.2.326-.2.373 0l2.742 11.59h-5.857zm8.064-12.546a5.257 5.257 0 0 0-1.864-3C33.808.39 32.718 0 31.502 0c-1.244 0-2.342.39-3.293 1.169-.95.779-1.565 1.779-1.844 3L21 27h5.136l1.218-5.143h8.293L36.865 27H42L36.636 4.17z" />
                    </g>
                </svg>
            </div>
            <div className="grow  flex flex-row items-center gap-9	 ">
                <Select className="ml-10 w-28 	" ></Select>
                <Search
                className="w-1/3"
                    placeholder="input search text"
                    enterButton="Tìm kiếm"
                    size="large"
                    onSearch={onSearch}
                />
            </div>
            <div className="flex-none w-1/4  flex flex-row items-center  py-2" >
            <Button href="/dashboard" className="font-normal  leading-5 btn-home	" style={{ fontSize: '18px',height:'100%' ,color:'rgb(128, 128, 137)' }}  type="text" icon={<HomeOutlined  />}>Trang Chủ</Button>
            {
                user ? (
                   
                        <Dropdown className="mx-5" overlay={menu} placement="bottomRight" arrow>
                            <Avatar src={user.avatar || undefined} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </Dropdown>
                       
                ) : (
                    <Button href="/login" className="font-normal  leading-5 btn-home	" style={{ fontSize: '18px',height:'100%' ,color:'rgb(128, 128, 137)' }}  type="text" icon={<SolutionOutlined />}>Tài Khoản</Button>
                )
            }
            <Button href="/cart" type="text" style={{fontSize: '20px', width:'40px', height:'100%' ,color:'#3AC5C9' }} icon={<ShoppingCartOutlined />} />
            <span className="text-xs bg-red-600 relative rounded w-full text-white  bottom-3 right-4 text-center" style={{width:'15px' ,borderRadius:'50px'}}  >1</span>
            </div>

        </div>
    );
}
