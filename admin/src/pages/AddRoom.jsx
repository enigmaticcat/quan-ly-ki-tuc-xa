import { useState } from 'react';
import { assets } from '../assets/assets'; 
import axios from 'axios';

const AddRoom = () => {
  const [image, setImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(assets.upload_area); 

  const [name, setName] = useState(''); // Sẽ dùng làm room_number
  const [building, setBuilding] = useState('B5');
  const [gender, setGender] = useState('Nam');
  const [capacity, setCapacity] = useState(4);
  const [floor, setFloor] = useState(1);
  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Lưu file object
      setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước
    }
  };

  const toggleFacility = (value) => {
    setFacilities(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  const resetForm = () => {
    setName('');
    setBuilding('B5');
    setGender('Nam');
    setCapacity(4);
    setFloor(1);
    setImage(null);
    setImagePreview(assets.upload_area); 
    setFacilities([]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!API_BASE_URL) {
        setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('room_number', name); 
    formData.append('building_name', building);
    formData.append('gender', gender);
    formData.append('capacity', String(capacity)); 
    formData.append('floor', String(floor));
    
    if (image) {
      formData.append('image', image); 
    }
    
    
    if (facilities.length > 0) {
        facilities.forEach(facility => {
            formData.append('accommodations', facility);
        });
    } else {
        // 
    }


    try {
      const response = await axios.post(`${API_BASE_URL}/room/createRoom`, formData, {
        headers: {
          // 
        },
      });

      if (response.data && response.data.status === 'success') {
        setSuccessMessage(response.data.message || 'Thêm phòng thành công!');
        resetForm(); 
        
      } else {
        setError(response.data.message || 'Thêm phòng thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error("Lỗi khi thêm phòng:", err);
      const serverErrorMessage = err.response?.data?.message || err.message || 'Đã có lỗi không mong muốn xảy ra.';
      setError(serverErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-5 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Thêm Phòng Mới</h2>

      {/* Thông báo lỗi và thành công */}
      {error && <p className="w-full p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</p>}
      {successMessage && <p className="w-full p-3 bg-green-100 text-green-700 rounded-md text-sm">{successMessage}</p>}

      <div>
        <p className="mb-1 text-sm font-medium text-gray-600">Ảnh phòng</p>
        <label htmlFor="room-image">
          <img
            className="w-40 h-28 object-cover border border-gray-300 rounded cursor-pointer hover:opacity-80"
            src={imagePreview} 
            alt="Chọn ảnh phòng"
          />
          <input
            type="file"
            id="room-image"
            hidden
            accept="image/*" 
            onChange={handleImageChange} 
            disabled={loading}
          />
        </label>
      </div>

      <div className="w-full max-w-md">
        <p className="mb-1 text-sm font-medium text-gray-600">Số phòng <span className="text-red-500">*</span></p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          type="text"
          placeholder="Ví dụ: 101, P.A203"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 min-w-[150px]">
          <p className="mb-1 text-sm font-medium text-gray-600">Tòa nhà <span className="text-red-500">*</span></p>
          <select 
            onChange={(e) => setBuilding(e.target.value)} 
            value={building} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={loading}
          >
            {['B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B13', 'B5b', 'B13b'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <p className="mb-1 text-sm font-medium text-gray-600">Giới tính <span className="text-red-500">*</span></p>
          <select 
            onChange={(e) => setGender(e.target.value)} 
            value={gender} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={loading}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            {/* <option value="Chung">Chung</option>  Tùy theo logic của bạn */}
          </select>
        </div>
        <div className="flex-1 min-w-[100px]">
          <p className="mb-1 text-sm font-medium text-gray-600">Sức chứa <span className="text-red-500">*</span></p>
          <input
            onChange={(e) => setCapacity(Number(e.target.value))}
            value={capacity}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            type="number"
            min="1"
            placeholder="4"
            required
            disabled={loading}
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <p className="mb-1 text-sm font-medium text-gray-600">Tầng <span className="text-red-500">*</span></p>
          <input
            onChange={(e) => setFloor(Number(e.target.value))}
            value={floor}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            type="number"
            min="1"
            placeholder="1"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-gray-600">Tiện nghi</p>
        <div className="flex gap-3 flex-wrap mt-1">
          {['Máy lạnh', 'Wifi', 'Tủ đồ', 'WC riêng', 'Ban công', 'Bếp nhỏ'].map((f) => ( // Thêm vài tiện nghi ví dụ
            <div
              key={f}
              onClick={() => !loading && toggleFacility(f)} 
              className={`cursor-pointer px-3 py-1.5 rounded-md text-sm border transition-colors
                ${facilities.includes(f) 
                  ? 'bg-primary/20 border-primary text-primary font-medium' 
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full max-w-xs py-2.5 mt-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Đang thêm...' : 'Thêm phòng'}
      </button>
    </form>
  );
};

export default AddRoom;