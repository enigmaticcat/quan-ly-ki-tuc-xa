// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\Request.jsx
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestLetter = () => {
  const { currentUser, userToken } = useContext(AppContext);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [donType, setDonType] = useState('Xác nhận đang ở KTX'); // Giá trị mặc định
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null); // State cho file đính kèm
  const [studentInfo, setStudentInfo] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(''); // State cho lỗi chung của form
  
  // Lấy thông tin cơ bản của sinh viên để hiển thị
  useEffect(() => {
    if (currentUser) {
      // Giả sử currentUser có các trường này. Nếu không, cần fetch từ API getUserInfo
      setStudentInfo({
        fullname: currentUser.fullname || 'N/A',
        mssv: currentUser.mssv || 'N/A',
        user_class: currentUser.user_class || 'N/A',
        // TODO: Thông tin phòng ở hiện tại của sinh viên (cần API riêng hoặc từ login)
        //current_room: 'Chưa có thông tin phòng' 
      });
    } else if (!userToken) { // Nếu không có token, có thể là chưa đăng nhập
        toast.warn("Vui lòng đăng nhập để gửi yêu cầu.");
        navigate('/login');
    }
  }, [currentUser, userToken, navigate]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập để gửi yêu cầu.");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung đơn.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('form_type', donType);
    formData.append('form_description', content);
    if (file) {
      formData.append('attachmentFile', file); // Tên trường phải là 'attachmentFile'
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/form/createForm`, formData, {
        headers: {
          // 'Authorization': `Bearer ${userToken}`, // Nếu API yêu cầu token
          // 'Content-Type': 'multipart/form-data' // Axios tự đặt
        }
      });

      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || "Gửi yêu cầu thành công!");
        // Reset form
        setDonType('Xác nhận đang ở KTX');
        setContent('');
        setFile(null);
        // Có thể điều hướng đến trang trạng thái hoặc làm mới danh sách lịch sử
        // navigate('/status'); 
      } else {
        toast.error(response.data.message || "Gửi yêu cầu thất bại.");
        setError(response.data.message || "Gửi yêu cầu thất bại.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi gửi yêu cầu.");
      setError(err.response?.data?.message || "Lỗi khi gửi yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!studentInfo && !currentUser) { // Nếu chưa có thông tin user và cũng chưa login
    return (
        <div className="p-10 text-center">
             <p className="text-gray-600 mb-4">Vui lòng đăng nhập để sử dụng chức năng này.</p>
        </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 border-t mt-10 font-sans text-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary uppercase tracking-wide">Yêu cầu Đơn từ</h2>

      {/* Thông tin sinh viên */}
      {studentInfo && (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Thông tin Sinh viên</h3>
          <p className="mb-1"><span className="font-medium text-gray-600">Họ và tên:</span> {studentInfo.fullname}</p>
          <p className="mb-1"><span className="font-medium text-gray-600">Mã số sinh viên:</span> {studentInfo.mssv}</p>
          <p className="mb-1"><span className="font-medium text-gray-600">Lớp:</span> {studentInfo.user_class}</p>
        </div>
      )}

      {/* Form gửi yêu cầu */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div>
          <label htmlFor="donType" className="block mb-2 text-base font-medium text-gray-700">Chọn loại đơn <span className="text-red-500">*</span></label>
          <select
            id="donType"
            value={donType}
            onChange={(e) => setDonType(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            <option value="Xác nhận đang ở KTX">Xác nhận đang ở KTX</option>
            <option value="Xin tạm hoãn thanh toán">Xin tạm hoãn thanh toán</option>
            <option value="Xin nghỉ ở tạm thời">Xin nghỉ ở tạm thời</option>
            <option value="Xin chuyển phòng">Xin chuyển phòng</option>
            <option value="Kiến nghị / Phản ánh">Kiến nghị / Phản ánh</option>
            <option value="Khác">Khác (ghi rõ ở nội dung)</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block mb-2 text-base font-medium text-gray-700">Nội dung đơn <span className="text-red-500">*</span></label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung chi tiết cho yêu cầu của bạn..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div>
          <label htmlFor="attachmentFile" className="block mb-2 text-base font-medium text-gray-700">Tệp đính kèm (nếu có)</label>
          <input
            type="file"
            id="attachmentFile"
            onChange={handleFileChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            disabled={isSubmitting}
          />
           {file && <p className="text-xs text-gray-500 mt-1">Đã chọn: {file.name}</p>}
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="text-right"> {/* Đổi text-end thành text-right cho Tailwind chuẩn */}
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-lg text-sm uppercase font-medium tracking-wide shadow-md disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </form>

      {/* Lịch sử yêu cầu (Sẽ làm ở trang Status.jsx) */}
      {/* 
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-primary uppercase">Lịch sử đơn từ</h2>
        <p>Xem lịch sử đơn từ và trạng thái của bạn tại trang <Link to="/status" className="text-primary underline hover:text-red-700">Trạng thái</Link>.</p>
      </div>
      */}
    </div>
  );
};

export default RequestLetter;