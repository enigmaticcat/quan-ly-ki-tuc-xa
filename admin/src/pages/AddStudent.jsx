import React, { useState } from 'react';
import { assets } from '../assets/assets';

const AddStudent = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [mssv, setMssv] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [dorm, setDorm] = useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert('Sinh viên mới đã được thêm (chỉ giao diện, chưa lưu vào backend)');
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold">Thêm sinh viên mới</h2>

      <div className="flex gap-4 items-center">
        <label htmlFor="student-img">
          <img
            src={!image ? assets.profile_pic : URL.createObjectURL(image)}
            alt="avatar"
            className="w-20 h-20 object-cover rounded-full border cursor-pointer"
          />
        </label>
        <input
          type="file"
          id="student-img"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <span className="text-gray-500 text-sm">Bấm vào ảnh để thay đổi</span>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Họ tên sinh viên</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Mã số sinh viên</label>
        <input
          type="text"
          value={mssv}
          onChange={(e) => setMssv(e.target.value)}
          placeholder="20200001"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Lớp</label>
        <input
          type="text"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          placeholder="K64 CNTT1"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Nơi ở (ký túc xá)</label>
        <input
          type="text"
          value={dorm}
          onChange={(e) => setDorm(e.target.value)}
          placeholder="B5 - Phòng 101"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Thêm sinh viên
      </button>
    </form>
  );
};

export default AddStudent;
