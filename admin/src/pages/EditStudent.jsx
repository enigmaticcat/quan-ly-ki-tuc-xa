import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { assets } from '../assets/assets';

/* 👉 Nếu sau này có Context/API, thay block mock này bằng fetch */
const mockStudents = [
  { id: 'sv1', name: 'Nguyễn Văn A', mssv: '20200001', class: 'K64 CNTT1', dorm: 'B5 - Phòng 101', image: assets.profile_pic },
  { id: 'sv2', name: 'Trần Thị B', mssv: '20200002', class: 'K64 CNTT2', dorm: 'B7 - Phòng 202', image: assets.profile_pic },
  { id: 'sv3', name: 'Lê Văn C', mssv: '20200003', class: 'K64 KTMT', dorm: 'B6 - Phòng 303', image: assets.profile_pic },
];

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find((s) => s.id === id);

  /* --- State ràng buộc form --- */
  const [form, setForm] = useState(
    student || { name: '', mssv: '', class: '', dorm: '', image: null }
  );

  if (!student) return <p className="p-8 text-red-500">Không tìm thấy sinh viên.</p>;

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImage = (e) =>
    setForm({ ...form, image: e.target.files[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    /* TODO: call API PUT /students/:id */
    alert('Đã lưu thông tin (demo front-end).');
    navigate(`/student/${id}`); // quay về trang chi tiết
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-6 border p-6 rounded"
    >
      <h2 className="text-xl font-bold mb-2">Sửa thông tin sinh viên</h2>

      <div className="flex gap-4 items-center">
        <label htmlFor="student-img">
          <img
            src={
              form.image instanceof File
                ? URL.createObjectURL(form.image)
                : form.image || assets.profile_pic
            }
            alt="avatar"
            className="w-24 h-24 object-cover rounded-full border cursor-pointer"
          />
        </label>
        <input type="file" id="student-img" hidden onChange={handleImage} />
        <span className="text-gray-500 text-sm">Bấm để thay đổi ảnh</span>
      </div>

      <Input label="Họ tên" value={form.name} onChange={handleChange('name')} />
      <Input label="MSSV" value={form.mssv} onChange={handleChange('mssv')} />
      <Input label="Lớp" value={form.class} onChange={handleChange('class')} />
      <Input label="KTX" value={form.dorm} onChange={handleChange('dorm')} />

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Lưu thay đổi
      </button>
    </form>
  );
};

/* component input mini */
const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
);

export default EditStudent;
