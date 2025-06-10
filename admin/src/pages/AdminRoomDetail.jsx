// admin/src/pages/AdminRoomDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_STATIC_URL = 'http://localhost:5000';

const AdminRoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!roomId || !API_BASE_URL) {
      setError("Thông tin không hợp lệ.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch room details
        const roomRes = await axios.get(`${API_BASE_URL}/room/getRoomById/${roomId}`);
        if (roomRes.data && roomRes.data.status === 'success') {
          setRoom(roomRes.data.data);
        } else {
          throw new Error(roomRes.data.message || "Không thể tải thông tin phòng.");
        }

        // Fetch students in room
        const studentsRes = await axios.get(`${API_BASE_URL}/room/getStudentsInRoom/${roomId}`);
        if (studentsRes.data && studentsRes.data.status === 'success') {
          setStudents(studentsRes.data.data);
        } else {
          // Không coi là lỗi nghiêm trọng nếu không có sinh viên, nhưng có thể log
          console.warn(studentsRes.data.message || "Không có sinh viên hoặc lỗi tải danh sách SV.");
          setStudents([]);
        }
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu chi tiết phòng.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId, API_BASE_URL]);

  if (loading) return <p className="p-8 text-center">Đang tải...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Lỗi: {error}</p>;
  if (!room) return <p className="p-8 text-center">Không tìm thấy phòng.</p>;

  const currentOccupancy = students.length;
  const availableSlots = room.capacity - currentOccupancy;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-primary hover:underline">← Quay lại danh sách phòng</button>
      
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Chi tiết Phòng: {room.room_number} - Tòa {room.building_name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
          <p><strong>Giới tính:</strong> {room.gender}</p>
          <p><strong>Tầng:</strong> {room.floor}</p>
          <p><strong>Sức chứa:</strong> {room.capacity} người</p>
          <p><strong>Đang ở:</strong> {currentOccupancy} người</p>
          <p><strong>Còn trống:</strong> {availableSlots > 0 ? `${availableSlots} chỗ` : <span className="text-red-500">Hết chỗ</span>}</p>
          {room.image && (
            <div className="col-span-2 mt-2">
              <strong>Ảnh phòng:</strong>
              <img src={`${BACKEND_STATIC_URL}/uploads/${room.image}`} alt={`Phòng ${room.room_number}`} className="mt-1 max-w-xs h-auto rounded-md border"/>
            </div>
          )}
          {room.accommodations && room.accommodations.length > 0 && (
            <p className="col-span-2"><strong>Tiện nghi:</strong> {room.accommodations.join(', ')}</p>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Danh sách Sinh viên trong phòng</h3>
      {students.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">MSSV</th>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Email</th>
                {/* Thêm cột hành động nếu cần (ví dụ: xóa SV khỏi phòng) */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{student.mssv || 'N/A'}</td>
                  <td className="px-4 py-3 font-medium">{student.fullname || 'N/A'}</td>
                  <td className="px-4 py-3">{student.user_class || 'N/A'}</td>
                  <td className="px-4 py-3">{student.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 bg-white p-4 rounded-md shadow">Chưa có sinh viên nào trong phòng này.</p>
      )}
    </div>
  );
};
export default AdminRoomDetail;