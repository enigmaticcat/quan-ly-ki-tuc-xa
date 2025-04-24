import { useState } from 'react';

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    paymentMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanh toán thành công!');
    console.log('Dữ liệu gửi đi:', form);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Trang Thanh Toán</h2>

      {/* Thông tin đơn hàng */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h3>
        <div className="border p-4 rounded">
          <p>Phòng: <strong>Phòng 102 - B5</strong></p>
          <p>Loại: <strong>Ký túc xá nữ (6 người)</strong></p>
          <p>Thời gian: <strong>1 tháng</strong></p>
          <p>Tổng tiền: <strong>1.200.000đ</strong></p>
        </div>
      </div>

      {/* Form thanh toán */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ tên</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phương thức thanh toán</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn phương thức --</option>
            <option value="momo">Ví MoMo</option>
            <option value="vnpay">VNPay</option>
            <option value="bank">Chuyển khoản ngân hàng</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" required className="w-4 h-4" />
          <label className="text-sm">Tôi đồng ý với <a href="#" className="text-red-600 underline">điều khoản sử dụng</a></label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
        >
          Thanh toán
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
