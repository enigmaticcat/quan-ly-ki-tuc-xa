import React, { useState } from 'react';
import { rooms } from '../assets2/assets';
import { useNavigate } from 'react-router-dom';

const RoomList = () => {
  const [roomList, setRoomList] = useState(rooms);
  const navigate = useNavigate();

  const deleteRoom = (id) => {
    if (confirm('Bạn có chắc muốn xóa phòng này?')) {
      const newList = roomList.filter((room) => room._id !== id);
      setRoomList(newList);
    }
  };

  return (
    <>
      <p className="mb-4 text-xl font-semibold">Danh sách tất cả các phòng</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium">
          <span>Ảnh</span>
          <span>Tên phòng</span>
          <span>Tòa</span>
          <span>Giới tính</span>
          <span>Tầng</span>
          <span>Sức chứa</span>
          <span className="text-center">Hành động</span>
        </div>

        {roomList.map((room) => (
          <div
            key={room._id}
            className="grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 px-3 py-2 border text-sm"
          >
            <img src={room.image} alt="Ảnh phòng" className="w-full h-14 object-cover rounded-md" />
            <p>{room.name}</p>
            <p>{room.building}</p>
            <p>{room.gender}</p>
            <p>{room.floor}</p>
            <p>{room.capacity} người</p>
            <div className="flex justify-end md:justify-center gap-2">
            
              <button
                onClick={() => navigate(`/edit-room/${room._id}`)}
                className="text-blue-500 hover:underline"
              >
                📝 Sửa
              </button>
              <button
                onClick={() => deleteRoom(room._id)}
                className="text-red-500 hover:underline"
              >
                ❌ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomList;
