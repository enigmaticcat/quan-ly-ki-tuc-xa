// admin/src/pages/AdminBillDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminBillDetail = () => {
  const { billId } = useParams(); // Lấy billId từ URL
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!billId || !API_BASE_URL) {
      setError("ID hóa đơn hoặc URL API không hợp lệ.");
      setLoading(false);
      return;
    }

    const fetchBillDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/bill/getBillById/${billId}`);
        if (response.data && response.data.status === "success") {
          setBill(response.data.data);
        } else {
          setError(response.data.message || "Không tìm thấy thông tin hóa đơn.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Lỗi tải chi tiết hóa đơn.");
      } finally {
        setLoading(false);
      }
    };
    fetchBillDetail();
  }, [billId, API_BASE_URL]);

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn cập nhật trạng thái hóa đơn thành "${newStatus}"?`)) return;
    try {
        const response = await axios.put(`${API_BASE_URL}/bill/updateBillStatus/${billId}`, { status: newStatus });
        if (response.data && response.data.status === 'success') {
            toast.success("Cập nhật trạng thái thành công!");
            setBill(prevBill => ({ ...prevBill, status: newStatus, description: response.data.data.description })); // Cập nhật lại bill state
        } else {
            toast.error(response.data.message || "Cập nhật thất bại.");
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái.");
    }
  };

  if (loading) return <p className="p-8 text-center text-gray-600">Đang tải chi tiết hóa đơn...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Lỗi: {error}</p>;
  if (!bill) return <p className="p-8 text-center text-gray-500">Không tìm thấy hóa đơn.</p>;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)} // Quay lại trang trước (danh sách hóa đơn)
        className="mb-6 text-sm text-primary hover:underline flex items-center"
      >
        ← Quay lại danh sách hóa đơn
      </button>
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Chi tiết Hóa Đơn #{bill.id}</h2>
        <p className="text-sm text-gray-500 mb-6">Ngày tạo: {new Date(bill.bill_date).toLocaleDateString('vi-VN')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-1">Thông tin Sinh viên</h3>
            <p className="text-sm text-gray-600">ID: {bill.user_id}</p>
            <p className="text-sm text-gray-600">Họ tên: {bill.user_fullname || 'N/A'}</p>
            <p className="text-sm text-gray-600">Email: {bill.user_email || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-1">Trạng thái Hóa đơn</h3>
            <p className="text-sm">
                Trạng thái hiện tại: 
                <span className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full leading-none
                    ${bill.status && (bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'unpaid') ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${bill.status && bill.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : ''}
                    ${bill.status && bill.status.toLowerCase() === 'overdue' ? 'bg-red-100 text-red-800' : ''} 
                `}>
                    {bill.status || 'N/A'}
                </span>
            </p>
            {bill.description && <p className="text-xs text-gray-500 mt-1">Ghi chú Admin: {bill.description}</p>}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Các Mục Chi Phí</h3>
        {bill.items && bill.items.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              {bill.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <p className="text-sm text-gray-600">{item.item_type}</p>
                  <p className="text-sm font-medium text-gray-800">{parseFloat(item.amount).toLocaleString('vi-VN')} VNĐ</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Không có mục chi phí nào cho hóa đơn này.</p>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-800">Tổng cộng</p>
            <p className="text-lg font-semibold text-primary">
              {(bill.calculated_total_amount || 0).toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
        </div>

        {/* (Tùy chọn) Nút để Admin cập nhật trạng thái từ trang chi tiết */}
        {bill.status && (bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'unpaid') && (
            <div className="mt-8 text-right">
                <button
                    onClick={() => handleUpdateStatus('Paid')}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                >
                    Đánh dấu Đã Thanh Toán
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminBillDetail;