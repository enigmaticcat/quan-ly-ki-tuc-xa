import { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets'; 
import PropTypes from 'prop-types';

const Input = ({ label, value, onChange, type = 'text', disabled = false, required = false, name }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">{label}{required && <span className="text-red-500">*</span>}</label>
    <input
      name={name} 
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
      required={required}
      disabled={disabled}
      min={type === 'number' ? '1' : undefined} // Thêm min cho type number nếu cần
    />
  </div>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired, // name là bắt buộc để handler hoạt động
};


// Component Select mini
const Select = ({ label, value, onChange, options, disabled = false, required = false, name }) => (
    <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">{label}{required && <span className="text-red-500">*</span>}</label>
        <select
            name={name} // Gán prop 'name' vào thẻ select
            value={value} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
            required={required}
            disabled={disabled}
        >
            {options.map(opt => (
                // Nếu opt là string, dùng nó cho cả value và label
                // Nếu opt là object, dùng opt.value và opt.label
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
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                value: PropTypes.any.isRequired,
                label: PropTypes.string.isRequired,
            })
        ])
    ).isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired, // name là bắt buộc
};


const EditRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [roomData, setRoomData] = useState({
    room_number: '',
    building_name: 'B5', // Giá trị mặc định ban đầu
    gender: 'Nam',       // Giá trị mặc định ban đầu
    capacity: 4,         // Giá trị mặc định ban đầu
    floor: 1,            // Giá trị mặc định ban đầu
    accommodations: [],
    image: null, 
  });
  const [currentImagePreview, setCurrentImagePreview] = useState(assets.upload_area);
  const [newImageFile, setNewImageFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!roomId || !API_BASE_URL) {
        setError("ID phòng hoặc URL API không hợp lệ hoặc chưa được cấu hình.");
        setLoading(false);
        return;
    }
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/room/getRoomById/${roomId}`);
        if (response.data && response.data.status === 'success') {
          const fetchedRoom = response.data.data;
          setRoomData({ // Cập nhật đầy đủ state với dữ liệu từ API
            room_number: fetchedRoom.room_number || '',
            building_name: fetchedRoom.building_name || 'B5',
            gender: fetchedRoom.gender || 'Nam',
            capacity: fetchedRoom.capacity || 0, // Đặt giá trị mặc định nếu API không trả về
            floor: fetchedRoom.floor || 0,       // Đặt giá trị mặc định nếu API không trả về
            accommodations: fetchedRoom.accommodations || [],
            image: fetchedRoom.image || null,
          });
          if (fetchedRoom.image) {
            const BACKEND_STATIC_URL = 'http://localhost:5000';
            setCurrentImagePreview(`${BACKEND_STATIC_URL}/uploads/${fetchedRoom.image}`);
          } else {
            setCurrentImagePreview(assets.upload_area); // Hoặc một ảnh placeholder khác
          }
        } else {
          setError(response.data.message || 'Không thể tải thông tin phòng.');
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết phòng:", err);
        setError(err.response?.data?.message || err.message || 'Lỗi tải dữ liệu phòng.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [roomId, API_BASE_URL]); // Dependencies cho useEffect

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    // Đảm bảo giá trị là số và không âm, hoặc rỗng để người dùng có thể xóa
    const numValue = value === '' ? '' : Number(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0) ) {
        setRoomData(prev => ({ ...prev, [name]: value === '' ? '' : numValue }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setCurrentImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleFacility = (facilityValue) => {
    setRoomData(prev => ({
      ...prev,
      accommodations: prev.accommodations.includes(facilityValue)
        ? prev.accommodations.filter(f => f !== facilityValue)
        : [...prev.accommodations, facilityValue],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('room_number', roomData.room_number);
    formData.append('building_name', roomData.building_name);
    formData.append('gender', roomData.gender);
    formData.append('capacity', String(roomData.capacity));
    formData.append('floor', String(roomData.floor));
    
    if (newImageFile) {
      formData.append('image', newImageFile);
    }
    
    if (roomData.accommodations && roomData.accommodations.length > 0) {
        roomData.accommodations.forEach(facility => {
            formData.append('accommodations', facility);
        });
    } else {
        // Nếu backend yêu cầu trường 'accommodations' phải tồn tại dù rỗng
        // formData.append('accommodations', ''); // Hoặc một giá trị đặc biệt
    }
    
    try {
      const response = await axios.put(`${API_BASE_URL}/room/updateRoom/${roomId}`, formData);
      if (response.data && response.data.status === 'success') {
        setSuccessMessage(response.data.message || 'Cập nhật phòng thành công!');
        if (newImageFile) {
            // Nếu backend trả về tên file mới (hoặc bạn có thể fetch lại data)
            // setRoomData(prev => ({ ...prev, image: response.data.newImageName || prev.image }));
            setNewImageFile(null);
        }
        // setTimeout(() => navigate('/list-room'), 2000);
      } else {
        setError(response.data.message || 'Cập nhật phòng thất bại.');
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật phòng:", err);
      setError(err.response?.data?.message || err.message || 'Lỗi cập nhật phòng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Đang tải thông tin phòng...</p>;
  // Hiển thị lỗi nếu không load được data ban đầu VÀ chưa có room_number (nghĩa là chưa fetch được)
  if (error && !roomData.room_number && !loading) return <p className="p-8 text-center text-red-500">Lỗi: {error}</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-5 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sửa Thông Tin Phòng {roomData.room_number || `ID: ${roomId}`}</h2>
      
      {error && !successMessage && <p className="w-full p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
      {successMessage && <p className="w-full p-3 bg-green-100 text-green-700 rounded-md text-sm">{successMessage}</p>}

      <div>
        <p className="mb-1 text-sm font-medium text-gray-600">Ảnh phòng</p>
        <label htmlFor="room-image-edit">
          <img
            className="w-40 h-28 object-cover border border-gray-300 rounded cursor-pointer hover:opacity-80"
            src={currentImagePreview}
            alt="Ảnh phòng"
          />
          <input
            type="file"
            id="room-image-edit"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </label>
        {roomData.image && !newImageFile && <p className="text-xs text-gray-500 mt-1">Ảnh hiện tại: {roomData.image}</p>}
      </div>

      <div className="w-full max-w-md">
        <Input 
            label="Số phòng" 
            name="room_number" // TRUYỀN PROP NAME
            value={roomData.room_number} 
            onChange={handleInputChange} 
            required 
            disabled={isSubmitting} 
        />
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 min-w-[150px]">
            <Select 
                label="Tòa nhà"
                name="building_name" // TRUYỀN PROP NAME
                value={roomData.building_name}
                onChange={handleInputChange}
                options={['B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B13', 'B5b', 'B13b']}
                required
                disabled={isSubmitting}
            />
        </div>
        <div className="flex-1 min-w-[150px]">
             <Select 
                label="Giới tính"
                name="gender" // TRUYỀN PROP NAME
                value={roomData.gender}
                onChange={handleInputChange}
                options={['Nam', 'Nữ']}
                required
                disabled={isSubmitting}
            />
        </div>
        <div className="flex-1 min-w-[100px]">
            <Input 
                label="Sức chứa" 
                name="capacity" // TRUYỀN PROP NAME
                type="number" 
                value={roomData.capacity} 
                onChange={handleNumericInputChange} 
                required 
                disabled={isSubmitting} 
            />
        </div>
         <div className="flex-1 min-w-[100px]">
            <Input 
                label="Tầng" 
                name="floor" // TRUYỀN PROP NAME
                type="number" 
                value={roomData.floor} 
                onChange={handleNumericInputChange} 
                required 
                disabled={isSubmitting} 
            />
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-gray-600">Tiện nghi</p>
        <div className="flex gap-3 flex-wrap mt-1">
          {['Máy lạnh', 'Wifi', 'Tủ đồ', 'WC riêng', 'Ban công', 'Bếp nhỏ'].map((facility) => (
            <div
              key={facility}
              onClick={() => !isSubmitting && toggleFacility(facility)}
              className={`cursor-pointer px-3 py-1.5 rounded-md text-sm border transition-colors
                ${(roomData.accommodations || []).includes(facility) 
                  ? 'bg-primary/20 border-primary text-primary font-medium' 
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {facility}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          type="submit" 
          className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/list-room')}
          className="py-2 px-6 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          disabled={isSubmitting}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default EditRoom;