// admin/src/pages/ListBills.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
//import { Link } from 'react-router-dom'; // Nếu muốn link đến chi tiết user/phòng
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State để filter (ví dụ: theo status) - Tùy chọn
  const [statusFilter, setStatusFilter] = useState(''); // 'all', 'Paid', 'Pending', 'unpaid'

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const fetchBills = async () => {
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình API.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/bill/getAllBills`); // API lấy tất cả hóa đơn
      if (response.data && response.data.status === "success") {
        // Sắp xếp hóa đơn, ví dụ: mới nhất lên đầu
        const sortedBills = response.data.data.sort((a, b) => b.id - a.id);
        setBills(sortedBills);
      } else {
        setError(response.data.message || "Không thể tải danh sách hóa đơn.");
        setBills([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách hóa đơn:", err);
      setError(err.response?.data?.message || err.message || "Lỗi server khi tải danh sách hóa đơn.");
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [API_BASE_URL]); // Chỉ fetch lại khi API_BASE_URL thay đổi

  // Lọc hóa đơn dựa trên statusFilter
  const filteredBills = bills.filter(bill => {
    if (!statusFilter || statusFilter === 'all') return true;
    return bill.status && bill.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Hàm để admin có thể cập nhật trạng thái hóa đơn (ví dụ: đánh dấu là đã thanh toán nếu cần)
  // API updateBillStatus đã có, nhưng có thể không cần thiết nếu sinh viên tự "thanh toán"
  const handleUpdateBillStatusManually = async (billId, newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn đổi trạng thái hóa đơn #${billId} thành "${newStatus}"?`)) return;

    try {
        const response = await axios.put(`${API_BASE_URL}/bill/updateBillStatus/${billId}`, { status: newStatus });
        if (response.data && response.data.status === 'success') {
            toast.success(`Cập nhật trạng thái hóa đơn #${billId} thành công!`);
            fetchBills(); // Tải lại danh sách hóa đơn
        } else {
            toast.error(response.data.message || "Cập nhật thất bại.");
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái hóa đơn.");
    }
  };


  if (loading) return <p className="p-8 text-center text-gray-600">Đang tải danh sách hóa đơn...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Lỗi: {error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý Hóa Đơn</h2>

      {/* Phần Filter (Tùy chọn) */}
      <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-md shadow-sm">
        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
        <select 
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm py-2 px-3"
        >
          <option value="all">Tất cả</option>
          <option value="Paid">Đã thanh toán</option>
          <option value="Pending">Chờ thanh toán (Pending)</option>
          <option value="unpaid">Chưa thanh toán (Unpaid)</option>
          {/* Thêm các status khác nếu có */}
        </select>
      </div>

      {filteredBills.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10 bg-white shadow-md rounded-lg p-6">
          Không có hóa đơn nào phù hợp với bộ lọc.
        </p>
      )}

      {filteredBills.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-6 py-3">ID Hóa Đơn</th>
                <th scope="col" className="px-6 py-3">User ID</th>
                {/* TODO: Hiển thị Tên User */}
                <th scope="col" className="px-6 py-3">Ngày Hóa Đơn</th>
                {/* TODO: Hiển thị Tổng tiền (cần backend tính hoặc frontend tính từ items) */}
                <th scope="col" className="px-6 py-3">Trạng Thái</th>
                <th scope="col" className="px-6 py-3 text-center">Hành động (Admin)</th> 
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{bill.id}</td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/student-detail/${bill.user_id}`} className="text-primary hover:underline"> {/* Giả sử có trang chi tiết user ở admin */}
                        {bill.user_id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full leading-none
                      ${bill.status && (bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'unpaid') ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${bill.status && bill.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : ''}
                      ${bill.status && bill.status.toLowerCase() === 'overdue' ? 'bg-red-100 text-red-800' : ''} // Ví dụ status quá hạn
                    `}>
                      {bill.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {/* Admin có thể muốn xem chi tiết hóa đơn hoặc đánh dấu thanh toán thủ công */}
                    <button 
                        onClick={() => navigate(`/admin-bill-detail/${bill.id}`)}
                        className="text-blue-600 hover:underline text-xs mr-2"
                    >
                        Xem chi tiết
                    </button>
                    {bill.status && (bill.status.toLowerCase() === 'pending' || bill.status.toLowerCase() === 'unpaid') && (
                         <button 
                            onClick={() => handleUpdateBillStatusManually(bill.id, 'Paid')}
                            className="text-green-600 hover:underline text-xs"
                        >
                            Đánh dấu đã TT
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListBills;