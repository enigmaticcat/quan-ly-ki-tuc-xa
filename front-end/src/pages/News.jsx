// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\News.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const NewsPage = () => { // Đổi tên component cho rõ ràng hơn (trước là NotificationPage)
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!API_BASE_URL) {
        setError("Lỗi cấu hình API.");
        setLoading(false);
        return;
    }
    const fetchPublishedNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/notification/published`);
        if (response.data && response.data.status === 'success') {
          setNotifications(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải thông báo.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi server khi tải thông báo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedNotifications();
  }, [API_BASE_URL]);

  if (loading) return <p className="p-10 text-center">Đang tải thông báo...</p>;
  if (error) return <p className="p-10 text-center text-red-500">Lỗi: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-primary uppercase tracking-wide">
        Thông báo từ Ban Quản lý KTX
      </h2>

      {notifications.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10">Hiện chưa có thông báo nào.</p>
      )}

      {notifications.length > 0 && (
        <div className="flex flex-col gap-6">
          {notifications.map((notice) => (
            <div key={notice.id} className="border border-gray-200 bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-primary mb-1.5">{notice.title}</h3>
              <p className="text-xs text-gray-500 mb-3">
                Đăng ngày: {new Date(notice.created_at).toLocaleString('vi-VN')}
              </p>
              {/* Sử dụng dangerouslySetInnerHTML nếu content là HTML, hoặc pre-wrap nếu là text thuần */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"> 
                {notice.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage; // Đổi tên export