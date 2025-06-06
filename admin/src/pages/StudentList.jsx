// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\admin\src\pages\StudentList.jsx
import { useState, useEffect } from 'react'; // Bỏ 'React' không cần thiết
import { assets } from '../assets/assets'; // Dùng cho ảnh placeholder mặc định
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// URL gốc của backend để lấy ảnh tĩnh (ví dụ: từ thư mục /uploads)
const BACKEND_STATIC_URL = 'http://localhost:5000'; 

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/user/getAllUsers`);
        
        if (response.data && response.data.status === "success") {
          setStudents(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải danh sách sinh viên.");
          setStudents([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sinh viên:", err);
        setError(err.response?.data?.message || err.message || "Đã có lỗi xảy ra từ server.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [API_BASE_URL]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/user/deleteUser/${id}`);
        if (response.data && response.data.status === 'success') {
          setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
          alert(response.data.message || 'Xóa sinh viên thành công!');
          setOpenDropdownId(null); 
        } else {
          alert(response.data.message || 'Xóa sinh viên thất bại.');
        }
      } catch (err) {
        console.error("Lỗi khi xóa sinh viên:", err);
        alert(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra khi xóa.');
      }
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Đang tải danh sách sinh viên...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">Lỗi: {error}</p>;
  }

  return (
    <div>
      <p className="mb-4 text-xl font-semibold">Danh sách sinh viên</p>

      <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1.5fr_2fr_auto] items-center px-3 py-2 border-t border-b bg-gray-100 text-sm font-medium text-gray-600 gap-4">
        <span>Ảnh</span>
        <span>Họ tên</span>
        <span>MSSV</span>
        <span>Lớp</span>
        <span>Email</span>
        <span className="text-center">Tùy chọn</span>
      </div>

      {students.length === 0 && !loading && (
        <p className="p-8 text-center text-gray-500">Không có sinh viên nào để hiển thị.</p>
      )}

      {students.map((sv) => (
        <div
          key={sv.id}
          className="grid grid-cols-[auto_2fr_1fr_1.5fr_2fr_auto] items-center px-3 py-3 border-b text-sm text-gray-700 relative gap-4 hover:bg-gray-50 transition-colors"
        >
          <img 
            src={sv.avatar ? `${BACKEND_STATIC_URL}/uploads/${sv.avatar}` : assets.profile_pic}
            alt={sv.fullname || 'avatar'} 
            className="w-10 h-10 object-cover rounded-full bg-gray-200" // Thêm bg cho placeholder
            onError={(e) => { 
              e.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh placeholder cũng lỗi
              e.target.src = assets.profile_pic; // Fallback về ảnh mặc định trong assets
            }}
          />

          <Link to={`/student/${sv.id}`} className="text-blue-600 hover:underline font-medium">
            {sv.fullname || 'Chưa có tên'}
          </Link>

          <p>{sv.mssv || 'N/A'}</p>
          <p>{sv.user_class || 'N/A'}</p>
          <p className="truncate">{sv.email || 'N/A'}</p>
          
          <div className="text-center">
            <OptionsDropdown
              studentId={sv.id}
              open={openDropdownId === sv.id}
              onToggle={() => setOpenDropdownId(openDropdownId === sv.id ? null : sv.id)}
              onEdit={() => navigate(`/edit-student/${sv.id}`)}
              onDelete={() => handleDelete(sv.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Component OptionsDropdown (giữ nguyên như trước)
const OptionsDropdown = ({ studentId, open, onToggle, onEdit, onDelete }) => (
  <div className="relative">
    <button 
      onClick={onToggle} 
      className="px-2 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 focus:outline-none"
      aria-label="Tùy chọn"
    >
      ⋮
    </button>
    {open && (
      <div className="absolute top-full right-0 z-20 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1">
        <button onClick={() => { onEdit(studentId); onToggle(); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
          📝 Sửa
        </button>
        <button onClick={() => { onDelete(studentId); onToggle(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700">
          ❌ Xóa
        </button>
      </div>
    )}
  </div>
);

OptionsDropdown.propTypes = {
    studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default StudentList;