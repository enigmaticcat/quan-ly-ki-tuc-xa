// admin/src/components/Navbar.jsx
// import { assets } from '../assets/assets'; // Bỏ nếu không dùng logo
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext'; // Nếu dùng Context

const Navbar = () => {
  const navigate = useNavigate();

  // Lấy user từ localStorage để kiểm tra đã đăng nhập chưa (cách đơn giản)
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/'); 
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between shadow-sm'>
        <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1> {/* Hoặc logo */}
        {adminToken && ( 
            <button 
                onClick={handleLogout} 
                className='bg-red-500 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-red-600 transition'
            >
                Đăng xuất
            </button>
        )}
    </div>
  )
}

export default Navbar;