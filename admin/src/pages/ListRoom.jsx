import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// URL gốc của backend để lấy ảnh, không bao gồm /api
const BACKEND_STATIC_URL = 'http://localhost:5000'; // Hoặc lấy từ biến môi trường riêng

const RoomList = () => {
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/room/getAllRoom`);
        
        if (response.data && response.data.status === "success") {
          setRoomList(response.data.data);
        } else {
          setError(response.data.message || "Không thể tải danh sách phòng.");
          setRoomList([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách phòng:", err);
        setError(err.message || "Đã có lỗi xảy ra từ server.");
        setRoomList([]);
      } finally {
        setLoading(false);
      }
    };

    if (API_BASE_URL) { // Chỉ fetch nếu API_BASE_URL đã được định nghĩa
        fetchRooms();
    } else {
        setError("VITE_API_BASE_URL chưa được cấu hình trong file .env của admin.");
        setLoading(false);
    }
  }, [API_BASE_URL]);

  const deleteRoom = async (id) => { // Sửa hàm này để gọi API
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) { // Dùng window.confirm
      try {
        // TODO: Hiển thị loading khi xóa
        const response = await axios.delete(`${API_BASE_URL}/room/deleteRoom/${id}`);
        if (response.data && response.data.status === 'success') {
          setRoomList(prevList => prevList.filter((room) => room.id !== id));
          alert('Xóa phòng thành công!'); // Hoặc dùng react-toastify
        } else {
          alert(response.data.message || 'Xóa phòng thất bại.');
        }
      } catch (err) {
        console.error("Lỗi khi xóa phòng:", err);
        alert(err.message || 'Đã có lỗi xảy ra khi xóa phòng.');
      }
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Đang tải danh sách phòng...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">Lỗi: {error}</p>;
  }

  if (!roomList || roomList.length === 0) {
    return <p className="p-8 text-center">Không có phòng nào để hiển thị.</p>;
  }

  return (
    <>
      <p className="mb-4 text-xl font-semibold">Danh sách tất cả các phòng</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium">
          <span>Ảnh</span>
          <span>Số phòng</span>
          <span>Tòa</span>
          <span>Giới tính</span>
          <span>Tầng</span>
          <span>Sức chứa</span>
          <span>Tiện nghi</span>
          <span className="text-center">Hành động</span>
        </div>

        {roomList.map((room) => (
          <div
            key={room.id} // Sử dụng room.id từ API
            className="grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-3 py-2 border text-sm"
          >
            <img 
              src={room.image ? `${BACKEND_STATIC_URL}/uploads/${room.image}` : 'placeholder_image_url.jpg'} // Xử lý nếu không có ảnh
              alt={`Phòng ${room.room_number}`} 
              className="w-full h-14 object-cover rounded-md" 
            />
            <p>{room.room_number}</p> {/* API trả về room_number */}
            <p>{room.building_name}</p> {/* API trả về building_name */}
            <p>{room.gender}</p>
            <p>{room.floor}</p>
            <p>{room.capacity} người</p>
            <p className="text-xs truncate">{room.accommodations ? room.accommodations.join(', ') : 'Không có'}</p> {/* Hiển thị tiện nghi */}
            <div className="flex justify-end md:justify-center gap-2">
              <button
                onClick={() => navigate(`/edit-room/${room.id}`)} // Chuyển id từ API
                className="text-blue-500 hover:underline"
              >
                📝 Sửa
              </button>
              <button
                onClick={() => deleteRoom(room.id)} // Chuyển id từ API
                className="text-red-500 hover:underline"
              >
                ❌ Xóa
              </button>
              <button
  onClick={() => navigate(`/admin-room-detail/${room.id}`)} // Điều hướng
  className="text-purple-600 hover:underline text-xs" // Đổi màu cho khác nút Sửa/Xóa
>
  Chi Tiết
</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomList;