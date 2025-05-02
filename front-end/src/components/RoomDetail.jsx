import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { rooms } from '../assets/assets';

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const foundRoom = rooms.find((r) => r._id === id);
    if (foundRoom) {
      setRoom(foundRoom);
    }
  }, [id]);

  if (!room) return <div className="p-10">Không tìm thấy phòng...</div>;

  return (
    <div className="p-6 border-t">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Hình ảnh */}
        <div className="flex-1">
          <img
            src={room.image}
            alt={`Ảnh ${room.name}`}
            className="w-full h-64 object-cover rounded-md mb-3"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 text-gray-700 space-y-4">
          <h2 className="text-2xl font-bold">{room.name}</h2>
          <p><b>Tòa:</b> {room.building}</p>
          <p><b>Giới tính:</b> {room.gender}</p>
          <p><b>Sức chứa:</b> {room.capacity} người</p>
          <p><b>Tầng:</b> {room.floor}</p>
          <p><b>Tiện nghi:</b> {room.facilities.join(', ')}</p>

          <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
            Đăng ký phòng này
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
