import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*--------------left-section---------------*/}
                <div>
                    <img className='mb-5 w-40' src={assets.logoreal} alt='' />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6 '>
                        Kí túc xá của Đại học Bách Khoa Hà Nội
                    </p>
                </div>
                {/*--------------center-section---------------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>Liên kết nhanh</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Trang chủ</li>
                        <li>Đăng ký phòng</li>
                        <li>Thanh toán</li>
                        <li>Yêu cầu đơn từ</li>
                        <li>Thông báo</li>
                    </ul>
                </div>
                {/*--------------right-section---------------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>Liên hệ</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+84 0123-456-789</li>
                        <li>quanlykitucxa@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/*Copyright----------------------*/}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ HUST - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer