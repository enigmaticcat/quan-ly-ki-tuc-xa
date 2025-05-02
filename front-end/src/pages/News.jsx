import React, { useState } from 'react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([
    {
      title: 'Thông báo đóng tiền KTX tháng 5',
      content: 'Sinh viên vui lòng hoàn tất việc đóng tiền KTX tháng 5 trước ngày 10/05/2025 để tránh bị xử lý theo quy định.',
      date: '01/05/2025',
    },
    {
      title: 'Lịch cắt điện khu A',
      content: 'Do bảo trì, khu A sẽ cắt điện từ 8h00 đến 12h00 ngày 04/05/2025. Sinh viên vui lòng chủ động sạc thiết bị.',
      date: '30/04/2025',
    },
    {
      title: 'Tăng cường kiểm tra vệ sinh phòng ở',
      content: 'BQL KTX sẽ tiến hành kiểm tra vệ sinh định kỳ vào tuần tới. Các phòng cần dọn dẹp sạch sẽ, tránh để rác bừa bãi.',
      date: '27/04/2025',
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-red-700 uppercase tracking-wide">Thông báo từ ban quản lý KTX</h2>

      <div className="flex flex-col gap-6">
        {notifications.map((notice, index) => (
          <div key={index} className="border border-gray-300 bg-white shadow-sm rounded-lg p-5">
            <h3 className="text-xl font-semibold text-red-600 mb-1">{notice.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{notice.date}</p>
            <p className="text-base text-gray-800 leading-relaxed">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
