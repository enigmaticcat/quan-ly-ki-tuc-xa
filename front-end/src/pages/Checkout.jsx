// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\Checkout.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Sử dụng react-toastify
import PropTypes from 'prop-types';

const Checkout = () => {
  const { currentUser, userToken } = useContext(AppContext);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [studentInfo, setStudentInfo] = useState({
    fullname: '',
    mssv: '',
    user_class: '',
    // place: 'N/A', // Thông tin phòng ở cần lấy từ đâu đó khác
  });
  const [billToPay, setBillToPay] = useState(null); // Chỉ xử lý một hóa đơn cần thanh toán
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vn-pay'); // Giữ nguyên
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!currentUser || !userToken) {
      setError("Vui lòng đăng nhập để thực hiện thanh toán.");
      setLoading(false);
      // navigate('/login'); // Có thể điều hướng
      return;
    }

    if (!API_BASE_URL) {
        setError("Lỗi cấu hình API.");
        setLoading(false);
        return;
    }

    // Set thông tin sinh viên từ context
    setStudentInfo({
        fullname: currentUser.fullname || 'N/A',
        mssv: currentUser.mssv || 'N/A',
        user_class: currentUser.user_class || 'N/A',
        // TODO: Lấy thông tin phòng ở của sinh viên
    });

    const fetchUserBill = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/bill/getBillByUserId/${currentUser.id}`, {
          // headers: { 'Authorization': `Bearer ${userToken}` } // Nếu API yêu cầu
        });

        if (response.data && response.data.status === 'success' && response.data.data.length > 0) {
          // Tìm hóa đơn gần nhất chưa thanh toán (ví dụ: status là 'Pending' hoặc 'unpaid')
          const unpaidBill = response.data.data.find(bill => bill.status && (bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'unpaid'));
          if (unpaidBill) {
            setBillToPay(unpaidBill);
          } else {
            setError("Bạn không có hóa đơn nào cần thanh toán.");
          }
        } else if (response.data && response.data.data.length === 0) {
            setError("Bạn không có hóa đơn nào.");
        } else {
          setError(response.data.message || "Không thể tải thông tin hóa đơn.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Lỗi tải hóa đơn.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBill();
  }, [currentUser, userToken, API_BASE_URL, navigate]);

  const handlePayment = async () => {
    if (!billToPay) {
        toast.error("Không có hóa đơn để thanh toán.");
        return;
    }
    setIsProcessingPayment(true);
    try {
        // Giả lập gọi API thanh toán, sau đó cập nhật trạng thái hóa đơn
        // Trong thực tế, đây sẽ là một quy trình phức tạp hơn với cổng thanh toán

        // Sau khi "thanh toán" thành công, cập nhật status của bill
        const response = await axios.put(`${API_BASE_URL}/bill/updateBillStatus/${billToPay.id}`, 
            { status: 'Paid' }, // Backend đang mong đợi 'Paid' hoặc giá trị tương ứng
            { 
                // headers: { 'Authorization': `Bearer ${userToken}` } // Nếu API yêu cầu
            }
        );

        if (response.data && response.data.status === 'success') {
            toast.success("Thanh toán thành công!");
            setBillToPay(prev => ({ ...prev, status: 'Paid' })); // Cập nhật UI
            // Có thể điều hướng hoặc làm gì đó khác
        } else {
            toast.error(response.data.message || "Thanh toán thất bại.");
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi xử lý thanh toán.");
    } finally {
        setIsProcessingPayment(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Đang tải thông tin thanh toán...</p>;
  if (error && (!currentUser || !userToken)) {
    return (
        <div className="p-10 text-center">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">Đến trang Đăng nhập</button>
        </div>
    );
  }
  if (error) return <p className="p-10 text-center text-red-500">Lỗi: {error}</p>;
  if (!billToPay && !loading) return (
    <div className="p-10 text-center">
        <p className="text-gray-600">Hiện tại bạn không có hóa đơn nào cần thanh toán.</p>
    </div>
  );

  // Tính tổng tiền từ billToPay.items
  const totalAmount = billToPay && billToPay.items 
    ? billToPay.items.reduce((sum, item) => sum + parseFloat(item.amount), 0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 sm:flex sm:gap-10 border-t mt-10">
      {/* Thông tin khách hàng */}
      <div className="sm:w-1/2 w-full mb-10 sm:mb-0">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-700">Thông tin Sinh viên</h2>
        <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow">
          <InputDisplay label="Họ và tên" value={studentInfo.fullname} />
          <InputDisplay label="Mã số sinh viên" value={studentInfo.mssv} />
          <InputDisplay label="Lớp" value={studentInfo.user_class} />
          {/* <InputDisplay label="Phòng ở" value={studentInfo.place} /> */}
        </form>
      </div>

      {/* Thông tin hóa đơn */}
      {billToPay && (
        <div className="sm:w-1/2 w-full border border-gray-200 p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-700">Chi tiết Hoá đơn #{billToPay.id}</h2>
          <div className="text-sm text-gray-800 flex flex-col gap-2.5">
            {billToPay.items && billToPay.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.item_type}</span>
                <span className="font-medium">{parseFloat(item.amount).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            ))}
            <hr className="my-2 border-gray-300" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-red-600">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="mt-2">
                <span className="font-medium">Trạng thái: </span>
                <span className={`font-semibold ${billToPay.status && (billToPay.status.toLowerCase() === 'paid' || billToPay.status.toLowerCase() === 'đã thanh toán') ? 'text-green-600' : 'text-orange-500'}`}>
                    {billToPay.status && (billToPay.status.toLowerCase() === 'paid' || billToPay.status.toLowerCase() === 'đã thanh toán') ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
            </div>

            {/* Giả sử đây là nơi chọn phương thức thanh toán */}
            <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <p className="text-sm font-medium text-gray-700">Phương thức thanh toán:</p>
                <div
                    onClick={() => setPaymentMethod('vn-pay')}
                    className="flex items-center gap-3 border p-2 px-3 cursor-pointer rounded-md hover:bg-gray-50"
                >
                <div // Sử dụng div thay vì p cho radio button
                    className={`w-3.5 h-3.5 border-2 border-gray-400 rounded-full flex items-center justify-center ${
                    paymentMethod === 'vn-pay' ? 'bg-primary border-primary' : ''
                    }`}
                >
                    {paymentMethod === 'vn-pay' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <p className="text-gray-600 text-sm font-medium">VN PAY</p>
                </div>
                {/* Thêm các phương thức khác nếu có */}
            </div>
          </div>
          
          {billToPay.status && (billToPay.status.toLowerCase() === 'pending' || billToPay.status.toLowerCase() === 'unpaid') && (
            <button 
                onClick={handlePayment}
                className="w-full bg-primary text-white mt-8 py-2.5 rounded-md hover:bg-opacity-90 transition disabled:opacity-60"
                disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Đang xử lý..." : "Xác nhận Thanh toán"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Component con để hiển thị thông tin (chỉ đọc)
const InputDisplay = ({ label, value }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500 mb-0.5">{label}</label>
        <p className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-md text-sm text-gray-700 cursor-default">
            {value || 'N/A'}
        </p>
    </div>
);
InputDisplay.propTypes = { label: PropTypes.string, value: PropTypes.string };


export default Checkout;