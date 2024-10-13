import Image from "next/image";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
  totalPrice: number;
}

interface DetailsCheckoutProps {
  items: MenuItem[];
}

export default function DetailsCheckout({ items }: DetailsCheckoutProps) {
    
    return (
        <>
        
            <div className="mt-3 ml-10 grid grid-cols-12">
         
             <div className="col-span-6" >Món Ăn</div>
                <div className="col-span-2" >Đơn giá </div>
                <div className="col-span-2" >Số Lượng </div>
                <div className="col-span-2" >Thành tiền</div>
           
           
            </div>
       
            {items.map((item: MenuItem) => (
            <div key={item.id} className="mt-4 ml-10 grid grid-cols-12">
            <div className="col-span-6 flex flex-row items-center gap-3" >
                <div className="w-16 h-16 relative" > 
                    <Image  layout="fill" objectFit="cover" src={item.image_url} alt={item.name}  ></Image>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-base">{item.name}</span>
                    <span className="text-sm text-gray-600">{item.description}</span>
                </div>
            </div>
            <div className="col-span-2 ml-1 flex items-center" >₫{(Number(item.price) || 0).toLocaleString('vi-VN')} </div>
            <div className="col-span-2 ml-5 flex items-center">{item.quantity}</div>
            <div className="col-span-2 ml-5  flex items-center" >₫{(Number(item.totalPrice) || 0).toLocaleString('vi-VN')}</div>
        </div>
          
           ))}
        
        </>

    )

}
