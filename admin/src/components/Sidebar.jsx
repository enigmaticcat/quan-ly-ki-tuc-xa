// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\admin\src\components\Sidebar.jsx
//import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets'; // Đảm bảo đã import assets

const Sidebar = () => {
  // Hàm để tạo class cho NavLink, xử lý active state (Tùy chọn, cho React Router v6)
  // Bạn có thể dùng trực tiếp className hoặc cách này nếu muốn style active phức tạp hơn
  const navLinkClasses = ({ isActive }) => {
    return `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2.5 rounded-l-md hover:bg-gray-100 transition-colors ${
      isActive ? 'bg-primary/10 border-primary text-primary font-semibold' : 'text-gray-600' // Ví dụ style active
    }`;
  };

  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-200 bg-white'> {/* Thêm border-gray-200 */}
      <div className='flex flex-col gap-3 pt-8 pl-[15%] pr-[10%] text-sm'> {/* Giảm gap, tăng pt, giảm text size */}
        
        {/* Ví dụ sử dụng hàm navLinkClasses */}
        <NavLink className={navLinkClasses} to="/add-room">
          <img className="w-5 h-5" src={assets.add_icon} alt="Add Room Icon" />
          <p className="hidden md:block">Thêm phòng</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/list-room">
          <img className="w-5 h-5" src={assets.order_icon} alt="List Room Icon" />
          <p className="hidden md:block">Danh sách phòng</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/add-student">
          <img className="w-5 h-5" src={assets.add_icon} alt="Add Student Icon" />
          <p className="hidden md:block">Thêm sinh viên</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/list-student">
          <img className="w-5 h-5" src={assets.order_icon} alt="List Student Icon" />
          <p className="hidden md:block">Danh sách sinh viên</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/list-registrations">
          <img className="w-5 h-5" src={assets.order_icon} alt="Room Registrations Icon" />
          <p className="hidden md:block">Y/c Đăng ký Phòng</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/create-bill">
            <img className="w-5 h-5" src={assets.add_icon} alt="Create Bill Icon" />
            <p className="hidden md:block">Tạo Hóa Đơn</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/list-bills">
            <img className="w-5 h-5" src={assets.order_icon} alt="List Bills Icon" />
            <p className="hidden md:block">Quản lý Hóa Đơn</p>
        </NavLink>

        <NavLink className={navLinkClasses} to="/list-forms">
            <img className="w-5 h-5" src={assets.order_icon} alt="List Forms Icon" /> {/* Có thể đổi icon nếu muốn */}
            <p className="hidden md:block">Quản lý Đơn Từ</p>
        </NavLink>

        {/* Mục Quản lý Thông báo - Sửa ở đây */}
        <NavLink 
            className={navLinkClasses} // Sử dụng cùng class hoặc class tương tự
            to="/manage-notifications" 
        >
            <img className="w-5 h-5" src={assets.order_icon} alt="Manage Notifications Icon" /> {/* DÙNG CÙNG ICON */}
            <p className="hidden md:block">Quản lý Thông báo</p>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;