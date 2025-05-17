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

  if (!room) {
    return <div className="p-10 text-center text-lg text-red-500">Không tìm thấy phòng...</div>;
  }

  return (
    <div className="p-6 border-t max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Hình ảnh */}
        <div className="flex-1">
          <img
            src={room.image}
            alt={`Ảnh ${room.name}`}
            className="w-full h-72 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 text-gray-700 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{room.name}</h2>
          <div className="text-base space-y-2">
            <p><b>Tòa:</b> {room.building}</p>
            <p><b>Giới tính:</b> {room.gender === 'Nam' ? '👨 Nam' : '👩 Nữ'}</p>
            <p><b>Sức chứa:</b> {room.capacity} người</p>
            <p><b>Tầng:</b> {room.floor}</p>
            <p><b>Tiện nghi:</b> {room.facilities.join(', ')}</p>
            <p>
              <b>Trạng thái:</b>{' '}
              {room.available > 0 ? (
                <span className="text-green-600">Còn {room.available} chỗ</span>
              ) : (
                <span className="text-red-500">Hết chỗ</span>
              )}
            </p>
          </div>

          {room.available > 0 ? (
            <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
              Đăng ký phòng này
            </button>
          ) : (
            <div className="mt-6 text-red-500 font-semibold">
              Phòng này đã đầy. Vui lòng chọn phòng khác.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
