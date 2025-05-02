import {React, useState} from 'react';

const Checkout = () => {
  const [fullName, setFullName] = useState('Trần Minh');
  const [Id, setId] = useState('20250001');
  const [cl, setCl] = useState('KHMT - 03 - K67');
  const [place, setPlace] = useState('Toà B3 - Phòng 303')
  const [paymentMethod, setPaymentMethod] = useState('vn-pay');
  return (
    <div className="max-w-6xl mx-auto p-6 sm:flex sm:gap-10 border-t mt-10">
      {/* Customer Info */}
      <div className="sm:w-1/2 w-full mb-10 sm:mb-0">
        <h2 className="text-2xl font-semibold mb-6">Thông tin khách hàng</h2>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Mã số sinh viên"
            value={Id}
            onChange={(e) => setId(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Lớp"
            value={cl}
            onChange={(e) => setCl(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Phòng"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded"
          />
          
        </form>
      </div>

      {/* Order Summary */}
      <div className="sm:w-1/2 w-full border border-gray-300 p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Thông tin chi tiết hoá đơn</h2>

        <div className="text-sm text-gray-800 flex flex-col gap-3">
          <div className="flex justify-between">
            <span>Tiền phòng</span>
            <span className="font-medium">600,000 VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span>Tiền điện</span>
            <span className="font-medium">100,000 VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span>Tiền nước</span>
            <span className="font-medium">50,000 VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí quản lý</span>
            <span className="font-medium">20,000 VNĐ</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-red-600">770,000 VNĐ</span>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">

            
          <div
              onClick={() => {
                setPaymentMethod('vn-pay');
              }}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={` min-w-3.5 h-3.5 border rounded-full ${
                  paymentMethod === 'vn-pay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                
                VN PAY
              </p>
            </div>
          </div>
        </div>

        <button className="w-full bg-red-600 text-white mt-6 py-2 rounded hover:bg-red-700">
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Checkout;
