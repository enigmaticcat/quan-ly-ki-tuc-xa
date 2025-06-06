// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\admin\src\pages\EditStudent.jsx
import { useState, useEffect } from 'react'; // Thêm React, useEffect
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets'; // Dùng cho ảnh placeholder
import PropTypes from 'prop-types';

const BACKEND_STATIC_URL = 'http://localhost:5000';

// Component Input mini (cần prop name)
const Input = ({ label, value, onChange, type = 'text', disabled = false, required = false, name }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">{label}{required && <span className="text-red-500">*</span>}</label>
    <input
      name={name}
      type={type}
      value={value === null || value === undefined ? '' : value} // Xử lý giá trị null/undefined
      onChange={onChange}
      className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
      required={required}
      disabled={disabled}
      min={type === 'number' ? '0' : undefined}
    />
  </div>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]), // Cho phép Date cho birthday
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

// Component Select mini (cần prop name)
const Select = ({ label, value, onChange, options, disabled = false, required = false, name }) => (
  <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">{label}{required && <span className="text-red-500">*</span>}</label>
      <select
          name={name}
          value={value === null || value === undefined ? '' : value} // Xử lý giá trị null/undefined
          onChange={onChange} 
          className="w-full border px-3 py-2 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100"
          required={required}
          disabled={disabled}
      >
          {options.map(opt => (
              typeof opt === 'string' 
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
      </select>
  </div>
);
Select.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({value: PropTypes.any.isRequired, label: PropTypes.string.isRequired})])).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
};


const EditStudent = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [studentData, setStudentData] = useState({
    fullname: '', // API backend dùng fullname
    email: '',
    mssv: '',
    user_class: '',
    phone: '',
    address: '',
    gender: '',
    birthday: '', // Sẽ là YYYY-MM-DD
    avatar: null, // Tên file ảnh hiện tại
  });
  const [currentImagePreview, setCurrentImagePreview] = useState(assets.profile_pic);
  const [newImageFile, setNewImageFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!studentId || !API_BASE_URL) {
      setError("ID sinh viên hoặc URL API không hợp lệ.");
      setLoading(false);
      return;
    }
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/user/getUserInfo/${studentId}`);
        if (response.data && response.data.status === 'success') {
          const fetchedStudent = response.data.data;
          // Chuyển đổi birthday sang định dạng YYYY-MM-DD nếu nó là kiểu Date hoặc timestamp
          const formattedBirthday = fetchedStudent.birthday 
            ? new Date(fetchedStudent.birthday).toISOString().split('T')[0] 
            : '';

          setStudentData({
            fullname: fetchedStudent.fullname || '',
            email: fetchedStudent.email || '',
            mssv: fetchedStudent.mssv || '',
            user_class: fetchedStudent.user_class || '',
            phone: fetchedStudent.phone || '',
            address: fetchedStudent.address || '',
            gender: fetchedStudent.gender || '',
            birthday: formattedBirthday,
            avatar: fetchedStudent.avatar || null,
          });
          if (fetchedStudent.avatar) {
            setCurrentImagePreview(`${BACKEND_STATIC_URL}/uploads/${fetchedStudent.avatar}`);
          } else {
            setCurrentImagePreview(assets.profile_pic);
          }
        } else {
          setError(response.data.message || 'Không thể tải thông tin sinh viên.');
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sinh viên:", err);
        setError(err.response?.data?.message || err.message || 'Lỗi tải dữ liệu sinh viên.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [studentId, API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setCurrentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    const formDataToSend = new FormData();
    // Chỉ append những trường có giá trị và có thể được backend cập nhật
    // (backend updateUserInfo tự lọc các trường undefined)
    if (studentData.fullname) formDataToSend.append('fullname', studentData.fullname); // Sửa name thành fullname
    if (studentData.email) formDataToSend.append('email', studentData.email);
    if (studentData.mssv) formDataToSend.append('mssv', studentData.mssv);
    if (studentData.user_class) formDataToSend.append('user_class', studentData.user_class);
    if (studentData.phone) formDataToSend.append('phone', studentData.phone);
    if (studentData.address) formDataToSend.append('address', studentData.address);
    if (studentData.gender) formDataToSend.append('gender', studentData.gender);
    if (studentData.birthday) formDataToSend.append('birthday', studentData.birthday);
    
    if (newImageFile) {
      formDataToSend.append('avatar', newImageFile); // Tên trường là 'avatar'
    }
    
    // Kiểm tra xem có gì để gửi không (tránh gửi FormData rỗng nếu không có ảnh mới)
    const entries = Array.from(formDataToSend.entries());
    if (entries.length === 0 && !newImageFile) { // Nếu không có trường text nào VÀ không có ảnh mới
        setError("Không có thông tin nào để cập nhật.");
        setIsSubmitting(false);
        return;
    }


    try {
      const response = await axios.put(`${API_BASE_URL}/user/updateUserInfo/${studentId}`, formDataToSend);
      if (response.data && response.data.status === 'success') {
        setSuccessMessage(response.data.message || 'Cập nhật thông tin thành công!');
        if (response.data.data && response.data.data.avatar) { // Nếu backend trả về avatar mới
             setStudentData(prev => ({ ...prev, avatar: response.data.data.avatar }));
        }
        setNewImageFile(null); // Reset file mới sau khi submit
        // navigate(`/student/${studentId}`); // Tùy chọn: điều hướng
      } else {
        setError(response.data.message || 'Cập nhật thất bại.');
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật sinh viên:", err);
      setError(err.response?.data?.message || err.message || 'Lỗi cập nhật.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Đang tải thông tin sinh viên...</p>;
  if (error && !studentData.email && !loading) return <p className="p-8 text-center text-red-500">Lỗi: {error}</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-6 border p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">Sửa thông tin sinh viên</h2>

      {error && !successMessage &&<p className="w-full p-2 bg-red-100 text-red-700 rounded text-sm">{error}</p>}
      {successMessage && <p className="w-full p-2 bg-green-100 text-green-700 rounded text-sm">{successMessage}</p>}

      <div className="flex flex-col items-center gap-2 mb-2">
        <label htmlFor="student-edit-avatar" className="cursor-pointer">
          <img
            src={currentImagePreview}
            alt="avatar"
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 hover:opacity-80"
          />
        </label>
        <input type="file" id="student-edit-avatar" hidden onChange={handleImageChange} accept="image/*" disabled={isSubmitting}/>
        <span className="text-gray-500 text-xs">Bấm để thay đổi ảnh đại diện</span>
      </div>

      <Input label="Họ tên" name="fullname" value={studentData.fullname} onChange={handleInputChange} required disabled={isSubmitting} />
      <Input label="Email" name="email" type="email" value={studentData.email} onChange={handleInputChange} required disabled={isSubmitting} />
      <Input label="MSSV" name="mssv" value={studentData.mssv} onChange={handleInputChange} required disabled={isSubmitting} />
      <Input label="Lớp" name="user_class" value={studentData.user_class} onChange={handleInputChange} disabled={isSubmitting} />
      <Input label="Số điện thoại" name="phone" type="tel" value={studentData.phone} onChange={handleInputChange} disabled={isSubmitting} />
      <Input label="Địa chỉ" name="address" value={studentData.address} onChange={handleInputChange} disabled={isSubmitting} />
      
      <div className="grid md:grid-cols-2 gap-4">
        <Select 
            label="Giới tính" 
            name="gender" 
            value={studentData.gender} 
            onChange={handleInputChange} 
            options={[{value:'', label:'Chọn giới tính'}, {value:'Nam', label:'Nam'}, {value:'Nữ', label:'Nữ'}, {value:'Khác', label:'Khác'}]} 
            disabled={isSubmitting} 
        />
        <Input 
            label="Ngày sinh" 
            name="birthday" 
            type="date" 
            value={studentData.birthday} 
            onChange={handleInputChange} 
            disabled={isSubmitting} 
        />
      </div>
      {/* Trường KTX (dorm) không có trong model User hiện tại */}
      {/* <Input label="KTX" name="dorm" value={studentData.dorm} onChange={handleInputChange} disabled={isSubmitting} /> */}

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button 
            type="button" 
            onClick={() => navigate('/list-student')}
            className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
        >
            Hủy
        </button>
      </div>
    </form>
  );
};

export default EditStudent;