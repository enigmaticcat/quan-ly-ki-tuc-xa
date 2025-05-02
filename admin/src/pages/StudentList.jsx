import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const mockStudents = [
  {
    id: 'sv1',
    name: 'Nguyễn Văn A',
    mssv: '20200001',
    class: 'K64 CNTT1',
    dorm: 'B5 - Phòng 101',
    image: assets.profile_pic,
  },
  {
    id: 'sv2',
    name: 'Trần Thị B',
    mssv: '20200002',
    class: 'K64 CNTT2',
    dorm: 'B7 - Phòng 202',
    image: assets.profile_pic,
  },
  {
    id: 'sv3',
    name: 'Lê Văn C',
    mssv: '20200003',
    class: 'K64 KTMT',
    dorm: 'B6 - Phòng 303',
    image: assets.profile_pic,
  },
];

const StudentList = () => {
  const [students, setStudents] = useState(mockStudents);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <p className="mb-4 text-xl font-semibold">Danh sách sinh viên</p>
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-center px-3 py-2 border bg-gray-100 text-sm font-medium">
        <span>Ảnh</span>
        <span>Họ tên</span>
        <span>MSSV</span>
        <span>Lớp</span>
        <span>Nơi ở</span>
        <span>Tuỳ chọn</span>
      </div>

      {students.map((sv) => (
        <div
          key={sv.id}
          className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_1fr] items-center px-3 py-3 border text-sm relative"
        >
          <img src={sv.image} alt="avatar" className="w-12 h-12 object-cover rounded-full" />
          <p>{sv.name}</p>
          <p>{sv.mssv}</p>
          <p>{sv.class}</p>
          <p>{sv.dorm}</p>

          <div className="relative">
            <button
              onClick={() => setOpenDropdownId(openDropdownId === sv.id ? null : sv.id)}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-200"
            >
              ⋮
            </button>

            {openDropdownId === sv.id && (
              <div className="absolute top-full right-0 z-10 bg-white border rounded shadow mt-1 w-48 text-left">
                <button
                  onClick={() => navigate(`/edit-student/${sv.id}`)}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  📝 Sửa
                </button>
                <button
                  onClick={() => handleDelete(sv.id)}
                  className="block w-full px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  ❌ Xóa
                </button>
                <button
                  onClick={() => navigate(`/contract-tracking/${sv.id}`)}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  📑 Theo dõi hợp đồng
                </button>
                <button
                  onClick={() => navigate(`/payment-tracking/${sv.id}`)}
                  className="block w-full px-4 py-2 hover:bg-gray-100"
                >
                  💰 Theo dõi thanh toán
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
