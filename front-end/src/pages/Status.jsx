import React from 'react';

const StatusDashboard = () => {
  const data = [
    {
      title: 'Đơn từ',
      items: [
        { name: 'Xác nhận đang ở KTX', status: 'Đã duyệt', note: 'Đã cấp giấy xác nhận', date: '01/05/2025' },
        { name: 'Xin tạm hoãn thanh toán', status: 'Chờ duyệt', note: '', date: '30/04/2025' },
      ],
    },
    {
      title: 'Yêu cầu đăng ký phòng',
      items: [
        { name: 'Đăng ký lại phòng A302', status: 'Từ chối', note: 'Phòng đã đủ chỗ', date: '28/04/2025' },
        { name: 'Đăng ký mới phòng B105', status: 'Đã duyệt', note: 'Chuyển vào ngày 02/05', date: '26/04/2025' },
      ],
    },
    {
      title: 'Hợp đồng KTX',
      items: [
        { name: 'Hợp đồng kỳ 2/2025', status: 'Đã ký', note: 'Ký ngày 15/04/2025', date: '15/04/2025' },
        { name: 'Hợp đồng kỳ hè', status: 'Chờ ký', note: '', date: '02/05/2025' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-blue-700 uppercase tracking-wide">Tổng quan trạng thái</h2>

      <div className="grid gap-10">
        {data.map((section, i) => (
          <div key={i}>
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-1">{section.title}</h3>
            <table className="w-full text-sm border border-gray-300 shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Tên yêu cầu</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Ghi chú</th>
                  <th className="p-2 border">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border font-medium">{item.name}</td>
                    <td
                      className={`p-2 border font-semibold ${
                        item.status === 'Đã duyệt'
                          ? 'text-green-600'
                          : item.status === 'Chờ duyệt'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-2 border text-gray-600">{item.note || '-'}</td>
                    <td className="p-2 border text-gray-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDashboard;
