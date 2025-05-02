import React, { useState } from 'react';
import { assets } from '../assets/assets';

const AddRoom = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('B5');
  const [gender, setGender] = useState('Nam');
  const [capacity, setCapacity] = useState(4);
  const [floor, setFloor] = useState(1);
  const [facilities, setFacilities] = useState([]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert('Đây chỉ là giao diện thêm phòng. Không có xử lý backend.');
  };

  const toggleFacility = (value) => {
    setFacilities(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Ảnh phòng</p>
        <label htmlFor="room-image">
          <img
            className="w-40 h-28 object-cover border rounded cursor-pointer"
            src={!image ? assets.upload_icon : URL.createObjectURL(image)}
            alt="Ảnh phòng"
          />
          <input
            type="file"
            id="room-image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      </div>

      <div className="w-full">
        <p className="mb-2">Tên phòng</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Phòng 101"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div>
          <p className="mb-2">Tòa nhà</p>
          <select onChange={(e) => setBuilding(e.target.value)} className="px-3 py-2">
            {['B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B13', 'B5b', 'B13b'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Giới tính</p>
          <select onChange={(e) => setGender(e.target.value)} className="px-3 py-2">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sức chứa</p>
          <input
            onChange={(e) => setCapacity(Number(e.target.value))}
            value={capacity}
            className="px-3 py-2 w-24"
            type="number"
            min="1"
            placeholder="4"
          />
        </div>
        <div>
          <p className="mb-2">Tầng</p>
          <input
            onChange={(e) => setFloor(Number(e.target.value))}
            value={floor}
            className="px-3 py-2 w-24"
            type="number"
            min="1"
            placeholder="1"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 mt-4">Tiện nghi</p>
        <div className="flex gap-3 flex-wrap">
          {['Máy lạnh', 'Wifi', 'Tủ đồ', 'WC riêng'].map((f) => (
            <div
              key={f}
              onClick={() => toggleFacility(f)}
              className={`cursor-pointer px-3 py-1 rounded ${
                facilities.includes(f) ? 'bg-green-200' : 'bg-gray-200'
              }`}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="w-28 py-3 mt-6 bg-black text-white">
        Thêm phòng
      </button>
    </form>
  );
};

export default AddRoom;
