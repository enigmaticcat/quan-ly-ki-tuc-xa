import { useState } from 'react'; 
import { assets } from '../assets/assets'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(assets.profile_pic); 

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    mssv: '',
    user_class: '',
    phone: '',
    address: '',
    gender: '',
    birthday: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      setImageFile(null);
      setImagePreview(assets.profile_pic); 
    }
  };

  const resetForm = () => {
    setFormData({
      fullname: '', email: '', password: '', passwordConfirm: '',
      mssv: '', user_class: '', phone: '', address: '', gender: '', birthday: '',
    });
    setImageFile(null);
    setImagePreview(assets.profile_pic);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    
    if (!formData.fullname || !formData.email || !formData.password || !formData.mssv) {
        setError('Vui lòng điền đầy đủ các trường bắt buộc: Họ tên, Email, Mật khẩu, MSSV.');
        return;
    }

    setLoading(true);

    if (!API_BASE_URL) {
        setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
        setLoading(false);
        return;
    }

    // eslint-disable-next-line no-unused-vars
    const { passwordConfirm: _passwordConfirm, ...studentDataForApi } = formData;
    
    const dataToSend = new FormData(); 

    for (const key in studentDataForApi) {
      if (studentDataForApi[key] !== null && studentDataForApi[key] !== undefined) {
        dataToSend.append(key, studentDataForApi[key]);
      }
    }

    if (imageFile) {
      dataToSend.append('avatar', imageFile); 
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/adminCreateStudent`, dataToSend, {
      });

      if (response.data && response.data.status === 'success') {
        setSuccessMessage(response.data.message || "Thêm sinh viên thành công!");
        resetForm();
        setTimeout(() => navigate('/list-student'), 1500); 
      } else {
        setError(response.data.message || 'Thêm sinh viên thất bại.');
      }
    } catch (err) {
      console.error("Lỗi khi thêm sinh viên:", err);
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Thêm sinh viên mới</h2>

      {error && <p className="w-full p-2 bg-red-100 text-red-700 rounded text-sm">{error}</p>}
      {successMessage && <p className="w-full p-2 bg-green-100 text-green-700 rounded text-sm">{successMessage}</p>}

      {/* Phần upload ảnh */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <label htmlFor="student-avatar-upload" className="cursor-pointer">
          <img
            src={imagePreview} 
            alt="avatar"
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 hover:opacity-80"
          />
        </label>
        <input
          type="file"
          id="student-avatar-upload"
          hidden
          accept="image/*" 
          onChange={handleImageChange}
          disabled={loading}
        />
        <span className="text-gray-500 text-xs">Bấm vào ảnh để chọn avatar</span>
      </div>

      {/* Các input fields như trước */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Họ tên <span className="text-red-500">*</span></label>
        <input
          type="text" name="fullname" value={formData.fullname} onChange={handleInputChange}
          placeholder="Nguyễn Văn A"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          required disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Email <span className="text-red-500">*</span></label>
        <input
          type="email" name="email" value={formData.email} onChange={handleInputChange}
          placeholder="nguyenvana@email.com"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          required disabled={loading}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Mật khẩu <span className="text-red-500">*</span></label>
          <input
            type="password" name="password" value={formData.password} onChange={handleInputChange}
            placeholder="Mật khẩu cho sinh viên"
            className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
            required disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
          <input
            type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange}
            placeholder="Nhập lại mật khẩu"
            className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
            required disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Mã số sinh viên <span className="text-red-500">*</span></label>
        <input
          type="text" name="mssv" value={formData.mssv} onChange={handleInputChange}
          placeholder="20200001"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          required disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Lớp</label>
        <input
          type="text" name="user_class" value={formData.user_class} onChange={handleInputChange}
          placeholder="K64 CNTT1"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Số điện thoại</label>
        <input
          type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
          placeholder="09xxxxxxxx"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Địa chỉ</label>
        <input
          type="text" name="address" value={formData.address} onChange={handleInputChange}
          placeholder="Địa chỉ của sinh viên"
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
          disabled={loading}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Giới tính</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
            disabled={loading}>
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Ngày sinh</label>
          <input
            type="date" name="birthday" value={formData.birthday} onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-black text-white py-2.5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Đang xử lý...' : 'Thêm sinh viên'}
      </button>
    </form>
  );
};

export default AddStudent;