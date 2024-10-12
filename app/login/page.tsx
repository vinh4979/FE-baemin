'use client'
import { EyeInvisibleOutlined, EyeTwoTone, FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation';
import { notification } from "antd";
import { jwtDecode } from "jwt-decode";

const Page: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const decodedToken: any = jwtDecode(data.accessToken);
                const { sub, email } = decodedToken;
                localStorage.setItem('user', JSON.stringify({ sub, email }));
                console.log("User ID:", sub);
                console.log("Email:", email);
                localStorage.setItem('access-Token', data.accessToken); // Lưu access token
                // localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin người dùng
                notification.success({
                    message: 'Đăng nhập thành công',
                    description: 'Bạn đã đăng nhập thành công!',
                });
                router.push('/dashboard');
            } else {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
            });
            console.error('Lỗi:', error);
        }
    };

    return (
        <>
            <div className="mt-14 w-1/3 bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
                <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
                    Đăng Nhập
                </div>
                <div className="flex flex-col w-full gap-3">
                    <Input
                        placeholder="Email/Số điện thoại/Tên đăng nhập"
                        className="h-[40px]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full mt-3">
                    <Input.Password
                        placeholder="Mật khẩu"
                        className="h-[40px]"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-full mt-3">
                    <button onClick={handleLogin} className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg">
                        Đăng Nhập
                    </button>
                    <div className="flex flex-row justify-between items-center w-full text-sm text-beamin">
                        <span className="cursor-pointer">Quên mật khẩu </span>
                        <span className="cursor-pointer">Đăng nhập bằng SMS </span>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-600">HOẶC</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-5 h-[40px] ">
                        <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
                            <FacebookOutlined />
                            <span>Facebook</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 border w-full h-full p-1 text-beamin text-base">
                        <GoogleOutlined />
                            <span>Google</span>
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-gray-600">Bạn mới biết đến Baemin? 
                        </span>
                        <Link className="text-beamin cursor-pointer" href={"/register"}> Đăng kí</Link>
                    </div>
            </div>
        </>


    );

}
export default Page;