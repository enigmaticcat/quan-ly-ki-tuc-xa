// admin/src/pages/ListForms.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom'; // Nếu muốn có link chi tiết

const ListForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal xử lý đơn (nếu dùng modal)
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminReply, setAdminReply] = useState('');
  const [newStatus, setNewStatus] = useState(''); // 'Approved', 'Rejected', 'Processing'
  const [formDetailModal, setFormDetailModal] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BACKEND_STATIC_URL = 'http://localhost:5000'; // Cho file đính kèm

  const fetchForms = async () => {
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình API.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Backend API getAllForms đã JOIN với USERS để lấy user_fullname, user_email
      const response = await axios.get(`${API_BASE_URL}/form/getAllForms`);
      if (response.data && response.data.status === "success") {
        setForms(response.data.data.sort((a, b) => b.id - a.id)); // Mới nhất lên đầu
      } else {
        setError(response.data.message || "Không thể tải danh sách đơn từ.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi server khi tải đơn từ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [API_BASE_URL]);

  const openProcessModal = (form, statusAction) => {
    setSelectedForm(form);
    setNewStatus(statusAction); // 'Approved', 'Rejected', etc.
    setAdminReply(form.form_reply || ''); // Lấy reply cũ nếu có
    setIsModalOpen(true);
  };

  const handleProcessForm = async () => {
    if (!selectedForm || !newStatus) return;

    if (newStatus === 'Rejected' && !adminReply.trim()) {
      toast.error("Vui lòng nhập lý do từ chối/phản hồi.");
      return;
    }

    try {
      const payload = {
        form_status: newStatus,
        form_reply: adminReply.trim() || null,
      };
      const response = await axios.put(`${API_BASE_URL}/form/updateForm/${selectedForm.id}`, payload);

      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || "Xử lý đơn từ thành công!");
        fetchForms(); // Tải lại danh sách
        setIsModalOpen(false);
        setSelectedForm(null);
        setAdminReply('');
      } else {
        toast.error(response.data.message || "Xử lý đơn từ thất bại.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi server khi xử lý đơn từ.");
    }
  };

  // Hàm xem chi tiết đơn từ (có thể mở modal hoặc trang mới)
  const viewFormDetails = async (formId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/form/getFormById/${formId}`);
      if (response.data && response.data.status === 'success') {
        setFormDetailModal(response.data.data); // show in modal
      } else {
        toast.error("Không thể tải chi tiết đơn từ.");
      }
    } catch (error) {
      toast.error("Lỗi khi tải chi tiết đơn từ.");
    }
  };



  if (loading) return <p className="p-8 text-center text-gray-600">Đang tải danh sách đơn từ...</p>;
  if (error) return <p className="p-8 text-center text-red-600">Lỗi: {error}</p>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quản lý Đơn Từ Sinh Viên</h2>

      {forms.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10 bg-white shadow-md rounded-lg p-6">
          Không có đơn từ nào.
        </p>
      )}
      
      {forms.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                <th scope="col" className="px-4 py-3">ID Đơn</th>
                <th scope="col" className="px-4 py-3">Người gửi</th>
                <th scope="col" className="px-4 py-3">Loại đơn</th>
                <th scope="col" className="px-4 py-3">Ngày gửi</th>
                <th scope="col" className="px-4 py-3">Trạng thái</th>
                <th scope="col" className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{form.id}</td>
                  <td className="px-4 py-3">{form.user_fullname || `User ID: ${form.user_id}`}</td>
                  <td className="px-4 py-3">{form.form_type}</td>
                  <td className="px-4 py-3">{new Date(form.created_at).toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full leading-none
                      ${form.form_status && form.form_status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${form.form_status && form.form_status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${form.form_status && form.form_status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${form.form_status && form.form_status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {form.form_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => viewFormDetails(form.id)}
                      className="text-blue-600 hover:underline text-xs mr-3"
                    >
                      Xem chi tiết
                    </button>
                    {form.form_status && form.form_status.toLowerCase() === 'pending' && (
                      <>
                        <button
                          onClick={() => openProcessModal(form, 'Approved')}
                          className="text-green-600 hover:underline text-xs mr-3"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => openProcessModal(form, 'Rejected')}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {form.form_status && form.form_status.toLowerCase() !== 'pending' && (
                      <span className="text-xs text-gray-400 italic">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal để xử lý đơn từ */}
      {isModalOpen && selectedForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Xử lý Đơn từ #{selectedForm.id} - Loại: {selectedForm.form_type}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1"><strong>Nội dung SV gửi:</strong></p>
              <p className="text-sm text-gray-800 p-2 border rounded bg-gray-50 max-h-32 overflow-y-auto">{selectedForm.form_description}</p>
            </div>
            <div className="mb-4">
              <label htmlFor="adminReply" className="block text-sm font-medium text-gray-700">
                Phản hồi / Lý do ({newStatus === 'Approved' ? 'Ghi chú thêm nếu cần' : 'Bắt buộc nếu Từ chối'}):
              </label>
              <textarea
                id="adminReply"
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder={newStatus === 'Rejected' ? "Nhập lý do từ chối..." : "Nhập ghi chú..."}
              ></textarea>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:col-start-2 sm:text-sm
                            ${newStatus === 'Approved' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : ''}
                            ${newStatus === 'Rejected' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
                            ${newStatus === 'Processing' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : ''}
                            focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={handleProcessForm}
              >
                Xác nhận {newStatus === 'Approved' ? 'Duyệt' : (newStatus === 'Rejected' ? 'Từ chối' : 'Cập nhật')}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {formDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Chi tiết Đơn Từ #{formDetailModal.id}</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Người gửi:</strong> {formDetailModal.user_fullname || `User ID: ${formDetailModal.user_id}`}</p>
              <p><strong>Loại đơn:</strong> {formDetailModal.form_type}</p>
              <p><strong>Nội dung:</strong> {formDetailModal.form_description}</p>
              <p><strong>Trạng thái:</strong> {formDetailModal.form_status}</p>
              <p><strong>Phản hồi Admin:</strong> {formDetailModal.form_reply || '-'}</p>
              <p><strong>Ngày gửi:</strong> {new Date(formDetailModal.created_at).toLocaleString('vi-VN')}</p>
              {formDetailModal.attachments && formDetailModal.attachments.length > 0 ? (
                <div>
                  <p><strong>File đính kèm:</strong> {formDetailModal.attachments[0].filename}</p>
                  <a
                    href={`${BACKEND_STATIC_URL}/uploads/${formDetailModal.attachments[0].file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Tải file
                  </a>
                </div>
              ) : (
                <p><strong>File đính kèm:</strong> Không có</p>
              )}
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setFormDetailModal(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListForms;