// admin/src/pages/CreateBill.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateBill = () => {
  const [users, setUsers] = useState([]); // Danh sách user để chọn
  const [selectedUserId, setSelectedUserId] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]); // Mặc định ngày hiện tại
  const [items, setItems] = useState([{ item_type: '', amount: '' }]);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // 1. Fetch danh sách users để admin chọn
  useEffect(() => {
    const fetchUsers = async () => {
      if (!API_BASE_URL) {
        setError("Lỗi cấu hình API.");
        setLoadingUsers(false);
        return;
      }
      try {
        setLoadingUsers(true);
        const response = await axios.get(`${API_BASE_URL}/user/getAllUsers`); // API lấy tất cả user
        if (response.data && response.data.status === "success") {
          setUsers(response.data.data);
        } else {
          setError("Không thể tải danh sách người dùng.");
        }
      } catch (err) {
        setError("Lỗi khi tải danh sách người dùng.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [API_BASE_URL]);

  // 2. Xử lý thay đổi item trong hóa đơn
  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...items];
    list[index][name] = name === 'amount' ? parseFloat(value) || '' : value;
    setItems(list);
  };

  const handleAddItem = () => {
    setItems([...items, { item_type: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return; // Không cho xóa item cuối cùng
    const list = [...items];
    list.splice(index, 1);
    setItems(list);
  };

  // 3. Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!selectedUserId) {
      setError("Vui lòng chọn sinh viên.");
      setIsSubmitting(false);
      return;
    }
    if (items.some(item => !item.item_type || item.amount === '' || isNaN(item.amount) || item.amount <= 0)) {
      setError("Vui lòng điền đầy đủ và hợp lệ cho tất cả các mục chi phí.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      user_id: parseInt(selectedUserId),
      bill_date: billDate,
      items: items.map(item => ({ item_type: item.item_type, amount: parseFloat(item.amount) }))
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/bill/createBill`, payload, {
        // headers: { 'Authorization': `Bearer ${adminToken}` } // Nếu API yêu cầu token admin
      });
      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || "Tạo hóa đơn thành công!");
        // Reset form
        setSelectedUserId('');
        setBillDate(new Date().toISOString().split('T')[0]);
        setItems([{ item_type: '', amount: '' }]);
        // navigate('/admin/list-bills'); // Điều hướng đến trang danh sách hóa đơn nếu có
      } else {
        toast.error(response.data.message || "Tạo hóa đơn thất bại.");
        setError(response.data.message || "Tạo hóa đơn thất bại.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi server khi tạo hóa đơn.");
      setError(err.response?.data?.message || "Lỗi server khi tạo hóa đơn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUsers) return <p className="p-8 text-center">Đang tải danh sách sinh viên...</p>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tạo Hóa Đơn Mới</h2>
      
      {error && <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-md rounded-lg">
        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
            Chọn Sinh viên <span className="text-red-500">*</span>
          </label>
          <select
            id="user_id"
            name="user_id"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            disabled={isSubmitting}
          >
            <option value="" disabled>-- Chọn sinh viên --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.fullname} (ID: {user.id}, MSSV: {user.mssv || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bill_date" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày hóa đơn <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="bill_date"
            name="bill_date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Các Mục Chi Phí</h3>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3 p-3 border rounded-md">
              <div className="flex-1">
                <label htmlFor={`item_type_${index}`} className="block text-xs font-medium text-gray-600">
                  Loại chi phí <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="item_type"
                  id={`item_type_${index}`}
                  placeholder="Ví dụ: Tiền phòng tháng 7"
                  value={item.item_type}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`amount_${index}`} className="block text-xs font-medium text-gray-600">
                  Số tiền (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  id={`amount_${index}`}
                  placeholder="Ví dụ: 600000"
                  value={item.amount}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  min="0"
                  step="1000"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
              {items.length > 1 && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-1 px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-sm"
                    disabled={isSubmitting}
                  >
                    Xóa mục
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            + Thêm mục chi phí
          </button>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting || loadingUsers}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo Hóa Đơn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBill;