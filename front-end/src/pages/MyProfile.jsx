import { useState, useEffect, useContext, useCallback } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const BACKEND_STATIC_URL = 'http://localhost:5000';

// --- Component Input ---
const Input = ({ label, value, onChange, type = 'text', disabled = false, required = false, name, placeholder = '' }) => (
  <div>
    {label && <label htmlFor={name} className="block mb-1 text-xs font-medium text-gray-500">{label}{required && <span className="text-red-500">*</span>}</label>}
    <input
      id={name}
      name={name}
      type={type}
      value={value === null || value === undefined ? '' : value}
      onChange={onChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 text-sm"
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      min={type === 'number' ? '0' : undefined}
    />
  </div>
);

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

// --- Component Select ---
const Select = ({ label, value, onChange, options, disabled = false, required = false, name }) => (
  <div>
    {label && <label htmlFor={name} className="block mb-1 text-xs font-medium text-gray-500">{label}{required && <span className="text-red-500">*</span>}</label>}
    <select
        id={name}
        name={name}
        value={value === null || value === undefined ? '' : value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 text-sm"
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
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({value: PropTypes.any.isRequired, label: PropTypes.string.isRequired})])).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

// --- Component MyProfile ---
const MyProfile = () => {
  const { currentUser, userToken, login: updateUserContext } = useContext(AppContext);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const initialUserData = {
    fullname: '', email: '', phone: '', address: '', gender: '',
    birthday: '', user_class: '', mssv: '', avatar: null,
  };
  const [userData, setUserData] = useState(initialUserData);
  const [imagePreview, setImagePreview] = useState(assets.profile_pic);
  const [newImageFile, setNewImageFile] = useState(null);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!currentUser || !currentUser.id || !userToken) {
      setError("Vui lòng đăng nhập để xem thông tin.");
      setLoading(false);
      return;
    }
    if (!API_BASE_URL) {
        setError("Lỗi cấu hình API.");
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const response = await axios.get(`${API_BASE_URL}/user/getUserInfo/${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (response.data && response.data.status === 'success') {
        const fetchedUser = response.data.data;
        setUserData({
          fullname: fetchedUser.fullname || '',
          email: fetchedUser.email || '',
          phone: fetchedUser.phone || '',
          address: fetchedUser.address || '',
          gender: fetchedUser.gender || '',
          birthday: fetchedUser.birthday ? new Date(fetchedUser.birthday).toISOString().split('T')[0] : '',
          user_class: fetchedUser.user_class || '',
          mssv: fetchedUser.mssv || '',
          avatar: fetchedUser.avatar || null,
        });
        if (fetchedUser.avatar) {
          setImagePreview(`${BACKEND_STATIC_URL}/uploads/${fetchedUser.avatar}`);
        } else {
          setImagePreview(assets.profile_pic);
        }
      } else {
        setError(response.data.message || "Không thể tải thông tin người dùng.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi tải thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, userToken, API_BASE_URL]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
        setNewImageFile(null);
        if (userData.avatar) {
            setImagePreview(`${BACKEND_STATIC_URL}/uploads/${userData.avatar}`);
        } else {
            setImagePreview(assets.profile_pic);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
    console.log("handleSubmit CALLED - Nút Lưu Thông Tin được nhấn hoặc form submit"); // DEBUG
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    const formDataToSubmit = new FormData();
    const fieldsToUpdate = ['fullname', 'phone', 'address', 'gender', 'birthday', 'user_class', 'mssv'];
    
    fieldsToUpdate.forEach(field => {
        if (userData[field] !== null && userData[field] !== undefined && userData[field] !== '') {
             formDataToSubmit.append(field, userData[field]);
        }
    });
    
    if (newImageFile) {
      formDataToSubmit.append('avatar', newImageFile);
    }
    
    const entries = Array.from(formDataToSubmit.entries());
    if (entries.length === 0 && !newImageFile) { 
        setError("Không có thông tin nào được thay đổi để cập nhật.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/user/updateUserInfo/${currentUser.id}`, formDataToSubmit, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      if (response.data && response.data.status === 'success') {
        setSuccessMessage(response.data.message || "Cập nhật thông tin thành công!");
        const updatedUserFromServer = response.data.data;
        
        updateUserContext(updatedUserFromServer, userToken); 

        setUserData(prev => ({
            ...prev, 
            ...updatedUserFromServer, 
            birthday: updatedUserFromServer.birthday ? new Date(updatedUserFromServer.birthday).toISOString().split('T')[0] : '',
        }));
        if (updatedUserFromServer.avatar) {
            setImagePreview(`${BACKEND_STATIC_URL}/uploads/${updatedUserFromServer.avatar}`);
        }
        setNewImageFile(null); 
        setIsEdit(false);
      } else {
        setError(response.data.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi khi cập nhật thông tin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    console.log("Nút HỦY được nhấn"); // DEBUG
    setIsEdit(false);
    fetchUserData(); 
    setNewImageFile(null); 
    setError(''); 
    setSuccessMessage('');
  };

  const handleEditClick = () => {
    console.log("Nút SỬA THÔNG TIN được nhấn - Chỉ nên đổi isEdit"); // DEBUG
    setIsEdit(true);
    setSuccessMessage('');
    setError('');
  };

  if (loading && (!userData || !userData.email) ) return <p className="p-10 text-center text-gray-600">Đang tải thông tin cá nhân...</p>;
  if (error && (!userData || !userData.email) && !loading && (!currentUser || !userToken)) {
     return (
        <div className="p-10 text-center">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">
                Đến trang Đăng nhập
            </button>
        </div>
    );
  }
  if (!currentUser) return (
    <div className="p-10 text-center">
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem thông tin.</p>
        <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">
            Đăng nhập
        </button>
    </div>
  );

  return (
    <div className='max-w-lg mx-auto flex flex-col gap-5 text-sm p-6 bg-white shadow-md rounded-lg mt-10 border-t'>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Thông tin Cá nhân</h2>

      {error && !successMessage && <p className="w-full p-2 bg-red-100 text-red-700 rounded text-sm text-center">{error}</p>}
      {successMessage && <p className="w-full p-2 bg-green-100 text-green-700 rounded text-sm text-center">{successMessage}</p>}
      
      <div className="flex flex-col items-center">
        <label htmlFor="profile-avatar-upload" className={`cursor-pointer mb-2 ${isEdit ? '' : 'pointer-events-none'}`}>
            <img className='w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-sm' 
                src={imagePreview} 
                alt="Profile Avatar" 
            />
        </label>
        {isEdit && (
            <input 
                type="file" 
                id="profile-avatar-upload"
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="block w-full max-w-xs text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-primary/10 file:text-primary
                           hover:file:bg-primary/20"
                disabled={isSubmitting}
            />
        )}
      </div>
      
      {/* Bọc các input trong form CHỈ KHI isEdit là true, hoặc toàn bộ div.
          Hiện tại bạn đang bọc toàn bộ các trường hiển thị và nút bằng một thẻ form.
          Điều này có nghĩa là nút "Sửa Thông Tin" (khi isEdit=false) cũng nằm trong form.
          Đó là lý do nó có thể submit.
      */}
      
      {/* Cách 1: Chỉ bọc các input sửa bằng form */}
      {!isEdit && (
        <div className="space-y-4">
            {/* Phần hiển thị thông tin khi không ở chế độ sửa */}
            <div>
                <label className="text-xs text-gray-500">Họ tên:</label>
                <p className='font-medium text-xl text-neutral-800 mt-1'>{userData.fullname || 'Chưa cập nhật'}</p>
            </div>
            <div>
                <label className="text-xs text-gray-500">Email:</label>
                <p className='text-gray-700 mt-1 text-base'>{userData.email || 'N/A'} <span className="text-xs text-gray-400">(không thể thay đổi)</span></p>
            </div>
            <div>
                <label className="text-xs text-gray-500">MSSV:</label>
                <p className='text-gray-700 mt-1 text-base'>{userData.mssv || 'Chưa cập nhật'}</p>
            </div>
            <hr className='my-4'/>
            {/* ... các trường hiển thị khác ... */}
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Thông tin liên hệ</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-1 text-neutral-700'>
                <div>
                    <label className="text-xs text-gray-500">Số điện thoại:</label>
                    <p className='text-gray-700 mt-1'>{userData.phone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Lớp:</label>
                    <p className='text-gray-700 mt-1'>{userData.user_class || 'Chưa cập nhật'}</p>
                </div>
            </div>
            <div className="mt-2">
                <label className="text-xs text-gray-500">Địa chỉ:</label>
                <p className='text-gray-700 mt-1 whitespace-pre-line'>{userData.address || 'Chưa cập nhật'}</p>
            </div>
            <hr className='my-4'/>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Thông tin cơ bản</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-1 text-neutral-700'>
                <div>
                    <label className="text-xs text-gray-500">Giới tính:</label>
                    <p className='text-gray-700 mt-1'>{userData.gender || 'Chưa cập nhật'}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-500">Ngày sinh:</label>
                    <p className='text-gray-700 mt-1'>{userData.birthday ? new Date(userData.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                </div>
            </div>
             <div className='mt-8 flex justify-center'>
                <button 
                    type="button" // Đảm bảo type="button"
                    className='border border-primary text-primary px-8 py-2.5 rounded-md hover:bg-primary/10 transition-all shadow-sm' 
                    onClick={handleEditClick} // Gọi hàm riêng để vào chế độ edit
                >
                    Sửa Thông Tin
                </button>
            </div>
        </div>
      )}

      {isEdit && (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phần form khi ở chế độ sửa */}
            <div>
                <Input name="fullname" label="Họ tên:" value={userData.fullname} onChange={handleInputChange} disabled={isSubmitting} required placeholder="Nhập họ tên"/>
            </div>
            <div>
                <label className="text-xs text-gray-500">Email:</label>
                <p className='text-gray-700 mt-1 text-base'>{userData.email || 'N/A'} <span className="text-xs text-gray-400">(không thể thay đổi)</span></p>
            </div>
            <div>
                <Input name="mssv" label="MSSV:" value={userData.mssv} onChange={handleInputChange} disabled={isSubmitting} required placeholder="Nhập MSSV"/>
            </div>
             <hr className='my-4'/>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Thông tin liên hệ</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-1 text-neutral-700'>
                 <div>
                    <Input name="phone" label="Số điện thoại:" type="tel" value={userData.phone} onChange={handleInputChange} disabled={isSubmitting} placeholder="Nhập số điện thoại"/>
                 </div>
                <div>
                    <Input name="user_class" label="Lớp:" value={userData.user_class} onChange={handleInputChange} disabled={isSubmitting} placeholder="Nhập lớp"/>
                </div>
            </div>
            <div className="mt-2">
                <label htmlFor="address" className="block mb-1 text-xs font-medium text-gray-500">Địa chỉ:</label>
                <textarea id="address" name="address" className='bg-gray-50 border border-gray-300 rounded w-full p-2 min-h-[60px] focus:ring-primary focus:border-primary text-sm' value={userData.address} onChange={handleInputChange} disabled={isSubmitting} placeholder="Nhập địa chỉ"></textarea>
            </div>
            <hr className='my-4'/>
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Thông tin cơ bản</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-1 text-neutral-700'>
                <div>
                    <Select 
                        name="gender" 
                        label="Giới tính:"
                        value={userData.gender} 
                        onChange={handleInputChange} 
                        options={[{value:'', label:'Chọn giới tính'}, {value:'Nam', label:'Nam'}, {value:'Nữ', label:'Nữ'}, {value:'Khác', label:'Khác'}]} 
                        disabled={isSubmitting} 
                    />
                </div>
                <div>
                    <Input name="birthday" label="Ngày sinh:" type="date" value={userData.birthday} onChange={handleInputChange} disabled={isSubmitting} />
                </div>
            </div>
            <div className='mt-8 flex justify-center'>
                <button 
                    type="submit"
                    className='bg-primary text-white px-8 py-2.5 rounded-md hover:bg-opacity-90 transition-all shadow-md disabled:opacity-60' 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu Thông Tin"}
                </button>
                <button 
                    type="button" 
                    className='ml-4 border border-gray-300 text-gray-600 px-6 py-2.5 rounded-md hover:bg-gray-100 transition-all shadow-sm' 
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                >
                    Hủy
                </button>
            </div>
        </form>
      )}
    </div>
  );
}

export default MyProfile;