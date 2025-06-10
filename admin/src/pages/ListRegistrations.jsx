// admin/src/pages/ListRegistrations.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types'; // Bạn có thể thêm nếu muốn, nhưng bỏ qua cho đơn giản ở đây

const ListRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State để lưu trữ thông tin chi tiết của user và room (nếu bạn muốn hiển thị tên thay vì ID)
  // Đây là phần nâng cao hơn, tạm thời chúng ta sẽ hiển thị ID trước.
  // const [usersInfo, setUsersInfo] = useState({}); 
  // const [roomsInfo, setRoomsInfo] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchRegistrations = async () => {
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập trong admin/.env.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/room/getAllRegistrations`);
      if (response.data && response.data.status === "success") {
        // Sắp xếp theo ID giảm dần để yêu cầu mới nhất lên đầu (hoặc theo ngày nếu có)
        const sortedRegistrations = response.data.data.sort((a, b) => b.id - a.id);
        setRegistrations(sortedRegistrations);
        
        // Nâng cao: Fetch thông tin user và room dựa trên ID (sẽ làm sau nếu cần)
        // Ví dụ: fetchUserDetailsForRegistrations(sortedRegistrations);
      } else {
        setError(response.data.message || "Không thể tải danh sách yêu cầu.");
        setRegistrations([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu cầu:", err);
      setError(err.response?.data?.message || err.message || "Lỗi server khi tải danh sách yêu cầu.");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [API_BASE_URL]); // Chỉ fetch lại nếu API_BASE_URL thay đổi (thường là không)

  const handleUpdateRequestStatus = async (registrationId, newStatus) => {
    let adminNote = '';
    let confirmationMessage = '';

    if (newStatus === 'Approved') {
      confirmationMessage = 'Bạn có chắc muốn DUYỆT yêu cầu này?';
      adminNote = window.prompt("Nhập ghi chú (nếu có) cho việc DUYỆT:", "Đã duyệt. Mời sinh viên hoàn tất thủ tục.");
      if (adminNote === null) return; // User nhấn Cancel
    } else if (newStatus === 'Rejected') {
      confirmationMessage = 'Bạn có chắc muốn TỪ CHỐI yêu cầu này?';
      adminNote = window.prompt("Nhập LÝ DO TỪ CHỐI (bắt buộc):");
      if (adminNote === null) return; // User nhấn Cancel
      if (!adminNote || adminNote.trim() === "") {
        alert("Vui lòng nhập lý do từ chối.");
        return;
      }
    } else {
      return; // Trạng thái không hợp lệ
    }

    if (!window.confirm(confirmationMessage)) {
        return;
    }

    try {
      const payload = { 
        status: newStatus,
        description: adminNote.trim() || null // Gửi null nếu adminNote rỗng sau khi trim
      };
      
      const response = await axios.put(`${API_BASE_URL}/room/updateRegistration/${registrationId}`, payload);

      if (response.data && response.data.status === 'success') {
        alert(response.data.message || `Yêu cầu đã được ${newStatus === 'Approved' ? 'duyệt' : 'từ chối'}.`);
        // Cập nhật lại item đó trong state registrations
        setRegistrations(prevRegs => 
          prevRegs.map(reg => 
            reg.id === registrationId ? { ...reg, status: newStatus, description: response.data.data.description } : reg
          )
        );
      } else {
        alert(response.data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert(err.response?.data?.message || err.message || "Lỗi server khi cập nhật.");
    }
  };


  if (loading) return <p className="p-8 text-center text-gray-600">Đang tải danh sách yêu cầu...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Lỗi: {error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Danh sách Yêu cầu Đăng ký Phòng</h2>
      
      {registrations.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10 bg-white shadow-md rounded-lg p-6">
          Hiện tại không có yêu cầu đăng ký phòng nào.
        </p>
      )}

      {registrations.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-3">ID Y/C</th>
                <th scope="col" className="px-6 py-3">User ID</th> 
                {/* TODO: Hiển thị tên User thay vì ID */}
                <th scope="col" className="px-6 py-3">Room ID</th>
                {/* TODO: Hiển thị tên Phòng thay vì ID */}
                <th scope="col" className="px-6 py-3">Nội dung Yêu cầu</th>
                <th scope="col" className="px-6 py-3">Ngày gửi</th>
                <th scope="col" className="px-6 py-3">Trạng thái</th>
                <th scope="col" className="px-6 py-3">Ghi chú Admin</th>
                <th scope="col" className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{reg.id}</td>
                  <td className="px-6 py-4">{reg.user_id}</td>
                  <td className="px-6 py-4">{reg.room_id}</td>
                  <td className="px-6 py-4">{reg.request_name}</td>
                  <td className="px-6 py-4">
                    {reg.registration_date ? new Date(reg.registration_date).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full leading-none
                      ${reg.status && reg.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${reg.status && reg.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${reg.status && reg.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {/* Hiển thị text dựa trên status đã chuẩn hóa */}
                      {reg.status && reg.status.toLowerCase() === 'pending' ? 'Chờ duyệt' : 
                       (reg.status && reg.status.toLowerCase() === 'approved' ? 'Đã duyệt' : 
                       (reg.status && reg.status.toLowerCase() === 'rejected' ? 'Đã từ chối' : reg.status))}
                    </span>
                  </td>
                  <td className="px-6 py-4">{reg.description || '-'}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {/* Kiểm tra bằng .toLowerCase() */}
                    {reg.status && reg.status.toLowerCase() === 'pending' && (
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleUpdateRequestStatus(reg.id, 'Approved')}
                          className="font-medium text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-xs transition-colors"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(reg.id, 'Rejected')}
                          className="font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-xs transition-colors"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                    {reg.status && reg.status.toLowerCase() !== 'pending' && (
                        <span className="text-xs text-gray-400 italic">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListRegistrations;