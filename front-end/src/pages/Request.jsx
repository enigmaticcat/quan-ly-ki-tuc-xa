import React, { useState } from 'react';

const RequestLetter = () => {
  const [donType, setDonType] = useState('Xác nhận');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert(`Yêu cầu đơn "${donType}" đã được gửi!\nNội dung: ${content}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-red-700 uppercase tracking-wide">Yêu cầu đơn từ</h2>

      {/* Thông tin sinh viên */}
      <div className="bg-white shadow-md border rounded-lg p-6 mb-8">
        <p className="mb-1"><span className="font-semibold">Họ và tên:</span> Nguyễn Văn A</p>
        <p className="mb-1"><span className="font-semibold">Mã số sinh viên:</span> 2021054321</p>
        <p className="mb-1"><span className="font-semibold">Lớp:</span> D21CNPM</p>
        <p><span className="font-semibold">Phòng:</span> KTX A - P301</p>
      </div>

      {/* Form gửi yêu cầu */}
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 bg-white shadow-md rounded-lg p-6">
        <div>
          <label className="block mb-2 text-base font-medium text-gray-700">Chọn loại đơn</label>
          <select
            value={donType}
            onChange={(e) => setDonType(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="Xác nhận">Xác nhận đang ở KTX</option>
            <option value="Tạm hoãn">Xin tạm hoãn thanh toán</option>
            <option value="Nghỉ ở">Xin nghỉ ở tạm thời</option>
            <option value="Kiến nghị">Kiến nghị / Phản ánh</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-base font-medium text-gray-700">Nội dung đơn</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung chi tiết..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-400"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-base font-medium text-gray-700">Tệp đính kèm (nếu có)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-sm uppercase font-medium tracking-wide shadow"
          >
            Gửi yêu cầu
          </button>
        </div>
      </form>

      {/* Lịch sử yêu cầu */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-red-700 uppercase">Lịch sử đơn từ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Ngày gửi</th>
                <th className="p-3 border">Loại đơn</th>
                <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">02/05/2025</td>
                <td className="p-3 border">Xác nhận KTX</td>
                <td className="p-3 border text-green-600 font-semibold">Đã duyệt</td>
                <td className="p-3 border">Có thể đến VP nhận đơn</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">30/04/2025</td>
                <td className="p-3 border">Tạm hoãn TT</td>
                <td className="p-3 border text-yellow-500 font-semibold">Chờ duyệt</td>
                <td className="p-3 border"></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">28/04/2025</td>
                <td className="p-3 border">Kiến nghị</td>
                <td className="p-3 border text-red-500 font-semibold">Từ chối</td>
                <td className="p-3 border">Nội dung không rõ ràng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestLetter;
