import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const NavBar = () => {

    const navigate = useNavigate();

    const [showMenu, setshowMenu] = useState(false);
    const [token, setToken] = useState(true);

    return (
        <div className='flex items-center justify-between text-md py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-56 cursor-pointer' src={assets.logoreal} alt='' />
            <ul className='hidden md:flex items-start gap-7 font-medium'>
                <NavLink to='/'>
                    <li className='py-1 hover:text-red-500'>Trang chủ</li>
                    <hr className='border-none outline-none h-0.5 bg-red-500 w-4/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/room-collection'>
                    <li className='py-1 hover:text-red-500'>Đăng ký phòng</li>
                    <hr className='border-none outline-none h-0.5 bg-red-500 w-4/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/check-out'>
                    <li className='py-1 hover:text-red-500'>Thanh toán</li>
                    <hr className='border-none outline-none h-0.5 bg-red-500 w-4/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/yeu-cau-don-tu'>
                    <li className='py-1 hover:text-red-500'>Yêu cầu đơn từ</li>
                    <hr className='border-none outline-none h-0.5 bg-red-500 w-4/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/thong-bao'>
                    <li className='py-1 hover:text-red-500'>Thông báo</li>
                    <hr className='border-none outline-none h-0.5 bg-red-500 w-4/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-2'>
                {
                    token
                        ? <div className='flex items-center gap-2 cursor-pointer group relative'>
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
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
                }
                {/* <img onClick={} className='w-6 md:hidden' src={assets.menu_icon} alt = "" /> */}
            </div>
        </div >
    )
}

export default NavBar