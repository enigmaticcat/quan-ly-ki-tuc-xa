// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\Status.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom'; // Link đã được import ở trên nếu bạn dùng

const BACKEND_STATIC_URL = 'http://localhost:5000'; // Cho file đính kèm

const StatusDashboard = () => {
  const [roomRegistrations, setRoomRegistrations] = useState([]);
  const [forms, setForms] = useState([]); // State cho các đơn từ khác
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser, userToken } = useContext(AppContext);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken || !currentUser) {
      setError("Vui lòng đăng nhập để xem trạng thái.");
      setLoading(false);
      return;
    }
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình API.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch yêu cầu đăng ký phòng
        const regResponse = await axios.get(`${API_BASE_URL}/room/getUserRegistrations/${currentUser.id}`);
        if (regResponse.data && regResponse.data.status === "success") {
          setRoomRegistrations(regResponse.data.data.sort((a, b) => b.id - a.id));
        } else {
          // Không set error nếu chỉ một API lỗi, để API kia vẫn chạy
          console.warn(regResponse.data.message || "Không thể tải trạng thái đăng ký phòng.");
        }

        // Fetch các đơn từ khác
        const formResponse = await axios.get(`${API_BASE_URL}/form/getUserForms/${currentUser.id}`);
        if (formResponse.data && formResponse.data.status === "success") {
          setForms(formResponse.data.data.sort((a, b) => b.id - a.id));
        } else {
          console.warn(formResponse.data.message || "Không thể tải trạng thái đơn từ.");
        }

      } catch (err) {
        console.error("Lỗi khi tải trạng thái:", err);
        setError(err.response?.data?.message || err.message || "Lỗi server khi tải trạng thái.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, currentUser, userToken]);


  if (loading) return <p className="p-10 text-center">Đang tải trạng thái...</p>;
  if (error && (!currentUser || !userToken)) { /* ... (như cũ) ... */ }
  if (error) return <p className="p-10 text-center text-red-500">Lỗi: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-primary uppercase tracking-wide">
        Theo dõi Trạng thái
      </h2>

      {/* Section: Yêu cầu đăng ký phòng */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Yêu cầu Đăng ký Phòng</h3>
        {roomRegistrations.length === 0 && !loading && (
            <p className="text-sm text-gray-500">Bạn chưa có yêu cầu đăng ký phòng nào.</p>
        )}
        {roomRegistrations.length > 0 && (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Nội dung Yêu cầu</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Ngày gửi</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Trạng thái</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Ghi chú từ Admin</th>
                </tr>
                </thead>
                <tbody className="text-gray-700">
                {roomRegistrations.map((reg) => (
                    <tr key={`reg-${reg.id}`} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 font-medium">{reg.request_name}</td>
                    <td className="px-4 py-3 text-gray-500">
                        {reg.registration_date ? new Date(reg.registration_date).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full leading-tight
                        ${reg.status && reg.status.toLowerCase() === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                        ${reg.status && reg.status.toLowerCase() === 'approved' ? 'bg-green-200 text-green-800' : ''}
                        ${reg.status && reg.status.toLowerCase() === 'rejected' ? 'bg-red-200 text-red-800' : ''}
                        `}>
                        {reg.status && reg.status.toLowerCase() === 'pending' ? 'Chờ duyệt' : 
                        (reg.status && reg.status.toLowerCase() === 'approved' ? 'Đã duyệt' : 
                        (reg.status && reg.status.toLowerCase() === 'rejected' ? 'Đã từ chối' : reg.status))}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{reg.description || '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </section>

      {/* Section: Các Đơn Từ Khác */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Các Đơn Từ Khác Đã Gửi</h3>
        {forms.length === 0 && !loading && (
            <p className="text-sm text-gray-500">Bạn chưa gửi đơn từ nào khác.</p>
        )}
         {forms.length > 0 && (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Loại Đơn</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Nội dung tóm tắt</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Ngày gửi</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">File Đính Kèm</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Trạng thái</th>
                    <th className="px-4 py-3 border-b-2 border-gray-200">Phản hồi Admin</th>
                </tr>
                </thead>
                <tbody className="text-gray-700">
                {forms.map((form) => (
                    <tr key={`form-${form.id}`} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="px-4 py-3 font-medium">{form.form_type}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-xs">{form.form_description}</td>
                    <td className="px-4 py-3 text-gray-500">
                        {form.created_at ? new Date(form.created_at).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                        {/* API getFormById trả về form.attachments là mảng */}
                        {form.attachments && form.attachments.length > 0 ? (
                            <a 
                                href={`${BACKEND_STATIC_URL}/uploads/${form.attachments[0].file_url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {form.attachments[0].filename}
                            </a>
                        ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                         <span className={`px-2 py-0.5 text-xs font-semibold rounded-full leading-tight
                        ${form.form_status && form.form_status.toLowerCase() === 'pending' ? 'bg-yellow-200 text-yellow-800' : ''}
                        ${form.form_status && form.form_status.toLowerCase() === 'approved' ? 'bg-green-200 text-green-800' : ''}
                        ${form.form_status && form.form_status.toLowerCase() === 'rejected' ? 'bg-red-200 text-red-800' : ''}
                        ${form.form_status && form.form_status.toLowerCase() === 'processing' ? 'bg-blue-200 text-blue-800' : ''}
                        `}>
                        {form.form_status}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{form.form_reply || '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </section>
    </div>
  );
};

export default StatusDashboard;