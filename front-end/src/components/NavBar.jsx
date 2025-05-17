import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    const notificationRef = useRef(null);

    // Đóng dropdown nếu click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotification(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='flex items-center justify-between text-md py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-56 cursor-pointer' src={assets.logoreal} alt='' />
            
            <ul className='hidden md:flex items-start gap-7 font-medium'>
                <li><button onClick={() => navigate('/')} className='py-1 hover:text-red-500'>Trang chủ</button></li>
                <li><button onClick={() => navigate('/room-collection')} className='py-1 hover:text-red-500'>Đăng ký phòng</button></li>
                <li><button onClick={() => navigate('/check-out')} className='py-1 hover:text-red-500'>Thanh toán</button></li>
                <li><button onClick={() => navigate('/yeu-cau-don-tu')} className='py-1 hover:text-red-500'>Yêu cầu đơn từ</button></li>
            </ul>

            <div className='flex items-center gap-4'>
                {token ? (
                    <div className='flex items-center gap-4 relative'>
                        {/* ✅ Bell icon with dropdown */}
                        <div className='relative' ref={notificationRef}>
                            <img
                                className='w-6 cursor-pointer hover:opacity-70 transition'
                                src={assets.bell}
                                alt="Thông báo"
                                onClick={() => setShowNotification(prev => !prev)}
                            />
                            <span className='absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs px-1 rounded-full'>2</span>

                            {/* Dropdown */}
                            {showNotification && (
                                <div className='absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50'>
                                    <p className='font-semibold text-gray-700 border-b pb-2'>Thông báo mới</p>
                                    <ul className='mt-2 text-sm text-gray-600 flex flex-col gap-2'>
                                        <li className='hover:text-black cursor-pointer'>Bạn có đơn đăng ký phòng mới.</li>
                                        <li className='hover:text-black cursor-pointer'>Thông báo thanh toán kỳ tháng 6.</li>
                                        <li className='hover:text-black cursor-pointer'>Phòng bạn ở sắp hết hạn hợp đồng.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Avatar và menu người dùng */}
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-12 rounded-full' src={assets.profile_pic} alt="" />
                            <img className='w-4' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>Thông tin cá nhân</p>
                                    <p onClick={() => navigate('status')} className='hover:text-black cursor-pointer'>Trạng thái</p>
                                    <p onClick={() => navigate('change-password')} className='hover:text-black cursor-pointer'>Đổi mật khẩu</p>
                                    <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Đăng xuất</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
                )}
            </div>
        </div>
    )
}

export default NavBar
