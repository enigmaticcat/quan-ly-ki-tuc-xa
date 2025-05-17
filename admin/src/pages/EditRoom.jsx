import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { rooms as allRooms } from '../assets2/assets';   // dùng cùng nguồn dữ liệu

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // tìm phòng theo id
  const room = allRooms.find((r) => r._id === id);

  // nếu không tìm thấy
  if (!room) return <p className="p-8 text-red-500">Không tìm thấy phòng.</p>;

  /* local state cho form */
  const [form, setForm] = useState({ ...room });

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    /* TODO: PUT /api/rooms/:id – hiện chỉ demo */
    alert('Đã lưu thông tin phòng (demo front-end).');
    navigate('/room-list');   // hoặc navigate(-1) quay về danh sách
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-6 flex flex-col gap-4 border p-6 rounded"
    >
      <h2 className="text-xl font-bold mb-2">Sửa thông tin phòng</h2>

      {/* Ảnh minh hoạ (chỉ hiển thị, không thay đổi ảnh) */}
      <img
        src={form.image}
        alt="room"
        className="w-full h-40 object-cover rounded mb-4"
      />

      <Input label="Tên phòng" value={form.name} onChange={update('name')} />
      <Input label="Tòa" value={form.building} onChange={update('building')} />
      <Input label="Giới tính" value={form.gender} onChange={update('gender')} />
      <Input label="Tầng" value={form.floor} onChange={update('floor')} />

      <Input
        label="Sức chứa"
        value={form.capacity}
        onChange={update('capacity')}
        type="number"
      />

      <Input
        label="Tiện nghi (phách bởi dấu phẩy)"
        value={form.facilities.join(', ')}
        onChange={(e) =>
          setForm({ ...form, facilities: e.target.value.split(',').map((s) => s.trim()) })
        }
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
      >
        Lưu thay đổi
      </button>
    </form>
  );
};

/* component input mini tái sử dụng */
const Input = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
);

export default EditRoom;
