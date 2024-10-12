'use client'
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page: React.FC = () => {
    const router = useRouter();
    // const handleNavigate = () => {
       
    //       router.push('/login');
        
    //   };

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e : any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            message.error("Mật khẩu không khớp");
            return;
        }

        const { confirmPassword, ...body } = formData;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                message.success('Đăng ký thành công');
                router.push('/login');
            } else {
                const errorData = await response.json();
                message.error(errorData.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
            message.error('Có lỗi xảy ra khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
         <div className="mt-28 w-1/3  bg-white border rounded-2xl flex flex-col p-5 gap-5 pb-8">
                <div className="flex justify-center items-center w-full text-beamin font-semibold text-[26px]">
                    Đăng Kí
                </div>
                <form onSubmit={handleSubmit}>

               
              <div className="gap-5 flex flex-col p-5">
                <div className="flex flex-col w-full gap-3 ">
                    <Input name="username" placeholder="Tên đăng nhập" className="h-[40px]" onChange={handleChange}/>
                </div>
               
                <div className="flex flex-col w-full gap-3">
                    <Input name="email" placeholder="Email" className="h-[40px]" onChange={handleChange}/>
                </div>

                <div className="flex flex-col w-full ">
                    <Input.Password
                        name="password"
                        placeholder="Mật khẩu"
                        className="h-[40px]"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col w-full ">
                    <Input.Password
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        className="h-[40px]"
                        onChange={handleChange}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <button type="submit" className="w-full h-[40px] uppercase text-white bg-beamin rounded-lg" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </div>
                </div>
                </form>
                <div className="flex items-center justify-center gap-1">
                        <span className="text-gray-600">Bạn đã có tài khoản? 
                        </span>
                        <Link className="text-beamin cursor-pointer" href={"/login"}> Đăng nhập</Link>
                    </div>  
            </div>
        </>


    );

}
export default Page;
