// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\components\NavBar.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const BACKEND_STATIC_URL = 'http://localhost:5000';

const NavBar = () => {
    const navigate = useNavigate();
    const { currentUser, userToken, logout: contextLogout } = useContext(AppContext);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);

    // Fetch thông báo chưa đọc
    useEffect(() => {
        // let intervalId; // Bỏ interval tạm thời để đơn giản
        const fetchUnreadNotifications = async () => {
            if (currentUser && currentUser.id && userToken && API_BASE_URL) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/user-notifications/unread/${currentUser.id}`, {
                        // headers: { 'Authorization': `Bearer ${userToken}` } // Nếu API yêu cầu
                    });
                    if (response.data && response.data.status === 'success') {
                        setUserNotifications(response.data.data || []);
                        setUnreadCount(response.data.unreadCount || 0);
                    }
                } catch (error) {
                    console.error("Lỗi fetch thông báo cá nhân:", error);
                    // Không set lỗi ở đây để không ảnh hưởng toàn bộ navbar nếu chỉ thông báo lỗi
                }
            } else {
                setUserNotifications([]);
                setUnreadCount(0);
            }
        };

        fetchUnreadNotifications();
        // intervalId = setInterval(fetchUnreadNotifications, 30000);
        // return () => clearInterval(intervalId);
    }, [currentUser, userToken, API_BASE_URL]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotificationDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        contextLogout(); 
        setShowUserMenu(false);
        setShowNotificationDropdown(false);
        navigate('/'); 
    };

    const handleNotificationClick = async (notification) => {
        // Đóng dropdown trước
        setShowNotificationDropdown(false); 
        
        // Đánh dấu đã đọc
        if (API_BASE_URL && notification.id && currentUser && userToken) {
             try {
                await axios.put(`${API_BASE_URL}/user-notifications/mark-read/${notification.id}`, {}, {
                    // headers: { 'Authorization': `Bearer ${userToken}` } // Nếu API yêu cầu
                });
                // Fetch lại để cập nhật unreadCount và danh sách
                const response = await axios.get(`${API_BASE_URL}/user-notifications/unread/${currentUser.id}`);
                if (response.data && response.data.status === 'success') {
                    setUserNotifications(response.data.data || []);
                    setUnreadCount(response.data.unreadCount || 0);
                }
            } catch (error) {
                console.error("Lỗi đánh dấu thông báo đã đọc:", error);
            }
        }
        // Điều hướng sau khi xử lý
        if (notification.link_to) {
            navigate(notification.link_to);
        }
    };
    
    const handleMarkAllAsRead = async () => {
        if (currentUser && currentUser.id && userToken && API_BASE_URL && unreadCount > 0) {
            try {
                await axios.put(`${API_BASE_URL}/user-notifications/mark-all-read/${currentUser.id}`, {}, {
                    // headers: { 'Authorization': `Bearer ${userToken}` } // Nếu API yêu cầu
                });
                setUserNotifications([]); 
                setUnreadCount(0);
                setShowNotificationDropdown(false); // Đóng dropdown
            } catch (error) {
                console.error("Lỗi đánh dấu tất cả đã đọc:", error);
            }
        }
    };

    return (
        <div className='flex items-center justify-between text-sm sm:text-md py-4 mb-5 border-b border-gray-200'> {/* Cập nhật text size, border color */}
            <Link to='/'> {/* Bọc logo bằng Link */}
                <img className='w-40 sm:w-48 cursor-pointer' src={assets.logoreal} alt='Logo KTX HUST' />
            </Link>
            
            <ul className='hidden md:flex items-center gap-5 lg:gap-7 font-medium text-gray-600'> {/* Cập nhật gap, color */}
                <li><Link to='/' className='py-1 px-2 hover:text-primary transition-colors rounded-md hover:bg-primary/10'>Trang chủ</Link></li>
                <li><Link to='/room-collection' className='py-1 px-2 hover:text-primary transition-colors rounded-md hover:bg-primary/10'>Đăng ký phòng</Link></li>
                <li><Link to='/check-out' className='py-1 px-2 hover:text-primary transition-colors rounded-md hover:bg-primary/10'>Thanh toán</Link></li>
                <li><Link to='/yeu-cau-don-tu' className='py-1 px-2 hover:text-primary transition-colors rounded-md hover:bg-primary/10'>Yêu cầu đơn từ</Link></li>
                <li><Link to='/thong-bao' className='py-1 px-2 hover:text-primary transition-colors rounded-md hover:bg-primary/10'>Thông báo chung</Link></li>
            </ul>

            <div className='flex items-center gap-3 sm:gap-5'> {/* Cập nhật gap */}
                {userToken && currentUser ? (
                    // --- PHẦN KHI ĐÃ ĐĂNG NHẬP ---
                    <div className='flex items-center gap-3 sm:gap-5 relative'>
                        {/* Bell icon with dropdown */}
                        <div className='relative' ref={notificationRef}>
                            <button // Sử dụng button để dễ style hơn và accessibility
                                aria-label="Thông báo"
                                onClick={() => setShowNotificationDropdown(prev => !prev)}
                                className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <img
                                    className='w-5 h-5 sm:w-6 sm:h-6'
                                    src={assets.bell}
                                    alt="Bell Icon"
                                />
                                {unreadCount > 0 && (
                                    <span className='absolute top-0 right-0 bg-red-500 text-white text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full transform translate-x-1/3 -translate-y-1/3'>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotificationDropdown && (
                                <div className='absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-80 overflow-y-auto'> {/* Giảm max-h */}
                                    <div className="flex justify-between items-center p-3 border-b sticky top-0 bg-white z-10">
                                        <p className='font-semibold text-gray-700 text-sm'>Thông báo của bạn</p>
                                        {userNotifications.length > 0 && (
                                            <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline focus:outline-none">Đánh dấu tất cả đã đọc</button>
                                        )}
                                    </div>
                                    {userNotifications.length > 0 ? (
                                        <ul className='text-xs text-gray-600 flex flex-col'>
                                            {userNotifications.map(notif => (
                                                <li 
                                                    key={notif.id} 
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className='p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                                                >
                                                    <p className="font-medium text-gray-800 text-[13px] mb-0.5 leading-snug">{notif.message}</p>
                                                    <p className="text-gray-400 text-[11px]">{new Date(notif.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="p-4 text-center text-xs text-gray-500">Bạn không có thông báo mới.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Avatar và menu người dùng */}
                        <div className='relative' ref={userMenuRef}>
                            <button // Sử dụng button
                                aria-label="Mở menu người dùng"
                                onClick={() => setShowUserMenu(prev => !prev)} 
                                className='flex items-center gap-1.5 sm:gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary'
                            >
                                <img 
                                    className='w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-gray-200' 
                                    src={currentUser.avatar ? `${BACKEND_STATIC_URL}/uploads/${currentUser.avatar}` : assets.profile_pic}
                                    alt={currentUser.fullname || "User Avatar"} 
                                    onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_pic; }}
                                />
                                <img className='w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200' src={assets.dropdown_icon} alt="dropdown" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                            </button>
                            {showUserMenu && (
                                <div className='absolute top-full right-0 mt-2 w-52 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-200'> {/* Tăng w-52 */}
                                    <div className='px-4 py-2 border-b mb-1'>
                                        <p className='text-sm font-medium text-gray-800 truncate' title={currentUser.fullname || currentUser.email}>
                                            {currentUser.fullname || currentUser.email}
                                        </p>
                                        <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                                    </div>
                                    <Link to='/my-profile' onClick={() => setShowUserMenu(false)} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors'>Thông tin cá nhân</Link>
                                    <Link to='/status' onClick={() => setShowUserMenu(false)} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors'>Trạng thái Yêu cầu</Link>
                                    <Link to='/change-password' onClick={() => setShowUserMenu(false)} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors'>Đổi mật khẩu</Link>
                                    <hr className="my-1"/>
                                    <button onClick={handleLogout} className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors'>Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : ( 
                    // --- PHẦN KHI CHƯA ĐĂNG NHẬP ---
                    <> 
                        <button 
                            onClick={() => navigate('/login')} 
                            className='bg-primary text-white px-5 py-2 sm:px-7 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hidden md:block hover:bg-opacity-90 transition-colors shadow-sm'
                        >
                            Đăng nhập / Đăng ký
                        </button>
                        {/* Nút cho mobile (nếu bạn muốn hiển thị trên mobile và ẩn nút kia) */}
                        <button 
                            onClick={() => navigate('/login')} 
                            className='md:hidden text-primary font-medium p-2 text-sm' // Hiện trên mobile, ẩn trên md trở lên
                        >
                            Đăng nhập
                        </button>
                    </>
                )}
            </div>
        </div> // Đóng thẻ div cha của toàn bộ NavBar
    );
};

export default NavBar;