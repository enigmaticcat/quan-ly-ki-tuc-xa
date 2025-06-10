// admin/src/pages/ManageNotifications.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';                                        // Nếu Admin không dùng AppContext, bạn cần lấy adminId từ localStorage nếu createNotification cần author_id

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotif, setCurrentNotif] = useState({ id: null, title: '', content: '', is_published: true });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Giả sử admin đã đăng nhập và thông tin admin (đặc biệt là id) được lưu
  // const { currentUser: adminUser } = useContext(AppContext); // Nếu admin cũng dùng context tương tự
  const adminUser = JSON.parse(localStorage.getItem('adminUser')); // Hoặc lấy từ localStorage của admin

  const fetchAdminNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notification/admin/all`);
      if (response.data && response.data.status === 'success') {
        setNotifications(response.data.data);
      } else {
        toast.error(response.data.message || "Không thể tải thông báo.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải thông báo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(API_BASE_URL) fetchAdminNotifications();
  }, [API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentNotif(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentNotif.title.trim() || !currentNotif.content.trim()) {
      toast.error("Tiêu đề và nội dung không được để trống.");
      return;
    }
    
    const payload = {
        title: currentNotif.title,
        content: currentNotif.content,
        is_published: currentNotif.is_published,
        author_id: adminUser ? adminUser.id : null // Gửi ID của admin tạo thông báo
    };

    try {
      let response;
      if (isEditing && currentNotif.id) {
        response = await axios.put(`${API_BASE_URL}/notification/admin/update/${currentNotif.id}`, payload);
      } else {
        response = await axios.post(`${API_BASE_URL}/notification/create`, payload);
      }

      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message);
        setShowForm(false);
        setIsEditing(false);
        setCurrentNotif({ id: null, title: '', content: '', is_published: true });
        fetchAdminNotifications(); // Tải lại danh sách
      } else {
        toast.error(response.data.message || "Thao tác thất bại.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi server.");
    }
  };

  const handleEdit = (notif) => {
    setCurrentNotif({ 
        id: notif.id, 
        title: notif.title, 
        content: notif.content, 
        is_published: notif.is_published 
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/notification/admin/delete/${id}`);
        if (response.data && response.data.status === 'success') {
          toast.success(response.data.message);
          fetchAdminNotifications();
        } else {
          toast.error(response.data.message || "Xóa thất bại.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi server khi xóa.");
      }
    }
  };

  const openNewForm = () => {
    setCurrentNotif({ id: null, title: '', content: '', is_published: true });
    setIsEditing(false);
    setShowForm(true);
  };

  if (isLoading) return <p className="p-6 text-center">Đang tải...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản lý Thông báo Chung</h2>
        <button
          onClick={openNewForm}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
        >
          + Tạo Thông báo mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white shadow-lg rounded-lg space-y-4 border">
          <h3 className="text-xl font-medium">{isEditing ? 'Sửa Thông báo' : 'Tạo Thông báo Mới'}</h3>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề <span className="text-red-500">*</span></label>
            <input type="text" name="title" id="title" value={currentNotif.title} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội dung <span className="text-red-500">*</span></label>
            <textarea name="content" id="content" rows="5" value={currentNotif.content} onChange={handleInputChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="is_published" id="is_published" checked={currentNotif.is_published} onChange={handleInputChange} className="h-4 w-4 text-primary border-gray-300 rounded"/>
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Đăng tải ngay</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">{isEditing ? 'Lưu thay đổi' : 'Tạo Thông báo'}</button>
            <button type="button" onClick={() => { setShowForm(false); setIsEditing(false); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Hủy</button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Tiêu đề</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-left">Người tạo</th>
              <th className="px-4 py-3 text-center">Đã đăng?</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {notifications.map(notif => (
              <tr key={notif.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate" title={notif.title}>{notif.title}</td>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(notif.created_at).toLocaleString('vi-VN')}</td>
                <td className="px-4 py-3">{notif.author_name || 'N/A'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${notif.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {notif.is_published ? 'Có' : 'Không'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <button onClick={() => handleEdit(notif)} className="text-blue-600 hover:underline text-xs mr-3">Sửa</button>
                  <button onClick={() => handleDelete(notif.id)} className="text-red-600 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNotifications;