// front-end/src/components/RoomDetail.jsx (Hoặc pages/RoomDetail.jsx)
import { useEffect, useState, useContext } from 'react'; // Thêm useContext
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate nếu muốn điều hướng
import axios from 'axios';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext'; // Import AppContext

const BACKEND_STATIC_URL = 'http://localhost:5000';

const RoomDetail = () => {
  const { id: roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // State cho nút đăng ký
  const [registrationMessage, setRegistrationMessage] = useState(''); // Thông báo đăng ký

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { currentUser, userToken } = useContext(AppContext); // Lấy thông tin user từ Context
  const navigate = useNavigate(); // Nếu muốn điều hướng sau đăng ký

  useEffect(() => {
    // ... (useEffect để fetchRoomDetail giữ nguyên như trước) ...
    if (!roomId || !API_BASE_URL) {
        setError("ID phòng hoặc URL API không hợp lệ.");
        setLoading(false);
        return;
    }

    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/room/getRoomById/${roomId}`);
        
        if (response.data && response.data.status === "success") {
          setRoom(response.data.data);
        } else {
          setError(response.data.message || "Không tìm thấy thông tin phòng.");
          setRoom(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết phòng:", err);
        setError(err.response?.data?.message || err.message || "Lỗi server khi tải chi tiết phòng.");
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();
  }, [roomId, API_BASE_URL]);


  const handleRoomRegistration = async () => {
    if (!userToken || !currentUser) {
      // Người dùng chưa đăng nhập, có thể điều hướng đến trang login hoặc hiển thị thông báo
      alert("Vui lòng đăng nhập để thực hiện chức năng này.");
      navigate('/login'); // Điều hướng đến trang login
      return;
    }

    if (!room) {
        alert("Thông tin phòng không khả dụng.");
        return;
    }

    setIsRegistering(true);
    setRegistrationMessage('');
    setError(null); // Xóa lỗi cũ (nếu có) từ việc fetch phòng

    const payload = {
      user_id: currentUser.id, // Lấy id từ user đang đăng nhập
      room_id: room.id,        // id của phòng hiện tại
      request_name: `Đăng ký phòng ${room.room_number} - Tòa ${room.building_name}`, // Tên yêu cầu ví dụ
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/room/createRegistration`, payload, {
        headers: {
          // Nếu API createRegistration yêu cầu token xác thực (nên có)
          // 'Authorization': `Bearer ${userToken}` 
          // Hiện tại API backend /api/room/createRegistration chưa có middleware protect
        }
      });

      if (response.data && response.data.status === 'success') {
        setRegistrationMessage(response.data.message || "Yêu cầu đăng ký phòng đã được gửi thành công!");
        // Tùy chọn: Vô hiệu hóa nút đăng ký sau khi thành công, hoặc thay đổi text
      } else {
        setRegistrationMessage(response.data.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi đăng ký phòng:", err);
      setRegistrationMessage(err.response?.data?.message || err.message || "Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setIsRegistering(false);
    }
  };


  // ... (phần if (loading), if (error), if (!room) giữ nguyên) ...
  if (loading) return <div className="p-10 text-center text-lg text-gray-500">Đang tải thông tin phòng...</div>;
  if (error) return <div className="p-10 text-center text-lg text-red-500">Lỗi: {error}</div>;
  if (!room) return <div className="p-10 text-center text-lg text-gray-600">Không tìm thấy phòng hoặc phòng không tồn tại.</div>;


  const facilitiesList = room.accommodations || [];
  const availableSlots = room.available_slots !== undefined ? room.available_slots : room.capacity; 

  return (
    <div className="p-6 border-t max-w-5xl mx-auto mt-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Hình ảnh */}
        <div className="flex-1">
          <img /* ... */ />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 text-gray-700 space-y-4">
          {/* ... (thông tin phòng như cũ) ... */}
          <h2 className="text-3xl font-bold text-gray-800">{`Phòng ${room.room_number}`}</h2>
          {/* ... các <p> khác ... */}

          {/* Hiển thị thông báo đăng ký */}
          {registrationMessage && (
            <p className={`mt-4 p-3 rounded-md text-sm ${registrationMessage.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {registrationMessage}
            </p>
          )}

          {availableSlots > 0 ? (
            <button 
                onClick={handleRoomRegistration}
                className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition font-medium shadow-md disabled:opacity-50"
                disabled={isRegistering || registrationMessage.includes('thành công')} // Vô hiệu hóa nếu đang xử lý hoặc đã thành công
            >
              {isRegistering ? 'Đang xử lý...' : (registrationMessage.includes('thành công') ? 'Đã gửi yêu cầu' : 'Đăng ký phòng này')}
            </button>
          ) : (
            <div className="mt-6 text-red-600 font-semibold p-3 bg-red-50 rounded-md">
              Phòng này đã đầy. Vui lòng chọn phòng khác.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;