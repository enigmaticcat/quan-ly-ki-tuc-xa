import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';     // vẫn dùng ảnh mặc định
import { useState } from 'react';

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

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find((s) => s.id === id);

  const [info] = useState(student); // để demo sửa inline

  if (!info) return <p className="p-8 text-red-500">Không tìm thấy sinh viên.</p>;

  const handleDelete = () => {
    alert('Đã xoá (demo front-end). Quay về danh sách.');
    navigate('/student-list');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border rounded mt-6 space-y-4">
      {/* ảnh + tên */}
      <div className="flex gap-4 items-center">
        <img src={info.image || assets.profile_pic} className="w-24 h-24 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-bold">{info.name}</h2>
          <p className="text-gray-600">MSSV: {info.mssv}</p>
        </div>
      </div>

      {/* thông tin chi tiết */}
      <div className="grid grid-cols-[120px_1fr] gap-2 text-gray-700">
        <span className="font-medium">Lớp:</span>
        <span>{info.class}</span>

        <span className="font-medium">Ký túc xá:</span>
        <span>{info.dorm}</span>

        {/* demo trạng thái */}
        <span className="font-medium">Hợp đồng:</span>
        <span className="text-green-600">Còn hiệu lực</span>

        <span className="font-medium">Thanh toán:</span>
        <span className="text-red-500">Chưa thanh toán tháng 6</span>

        <span className="font-medium">Các loại đơn từ:</span>
        <span className="text-red-500">Đơn xin nghỉ phép</span>
      </div>

      {/* nút tuỳ chọn */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => navigate(`/edit-student/${id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          📝 Sửa thông tin
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          ❌ Xoá sinh viên
        </button>
        {/* <button
          onClick={() => navigate(`/contract-tracking/${id}`)}
          className="px-4 py-2 border rounded text-sm"
        >
          📑 Hợp đồng
        </button>
        <button
          onClick={() => navigate(`/payment-tracking/${id}`)}
          className="px-4 py-2 border rounded text-sm"
        >
          💰 Thanh toán
        </button> */}
      </div>
    </div>
  );
};

export default StudentDetail;
