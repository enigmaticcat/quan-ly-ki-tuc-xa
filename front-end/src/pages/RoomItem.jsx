// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\RoomItem.jsx
//import React from 'react'; // Thêm React nếu bạn dùng JSX transform cũ hoặc các hook khác
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Dùng cho ảnh placeholder nếu cần

const BACKEND_STATIC_URL = 'http://localhost:5000'; // URL gốc của backend nơi chứa thư mục uploads

const RoomItem = ({ id, image, name, building, gender, capacity, floor, facilities, available }) => {
  const displayedFacilities = (facilities || []).slice(0, 2).join(', ');
  const remainingFacilitiesCount = facilities ? Math.max(0, facilities.length - 2) : 0;
  const remainingText = remainingFacilitiesCount > 0 ? ` +${remainingFacilitiesCount} khác` : '';

  const roomCardContent = (
    <div className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 h-full flex flex-col bg-white ${available === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
      <img 
        src={image ? `${BACKEND_STATIC_URL}/uploads/${image}` : assets.room1} // Sử dụng assets.room1 làm placeholder nếu không có ảnh
        alt={`Phòng ${name}`} 
        className="w-full h-40 object-cover" 
        onError={(e) => { e.target.onerror = null; e.target.src = assets.room1; }} // Fallback
      />
      <div className="p-4 text-sm space-y-1.5 flex-grow flex flex-col"> {/* Thêm flex-grow và flex-col */}
        <h3 className="font-semibold text-base text-gray-800 truncate" title={name}>{name}</h3>
        <p className="text-gray-600"><span className="font-medium">Tòa:</span> {building}</p>
        <p className="text-gray-600"><span className="font-medium">Giới tính:</span> {gender === 'Nam' ? '👨 Nam' : (gender === 'Nữ' ? '👩 Nữ' : 'Nam/Nữ')}</p>
        <p className="text-gray-600"><span className="font-medium">Sức chứa:</span> {capacity} người</p>
        <p className="text-gray-600"><span className="font-medium">Tầng:</span> {floor}</p>
        {(facilities || []).length > 0 && (
            <p className="text-gray-600" title={(facilities || []).join(', ')}>
            <span className="font-medium">Tiện nghi:</span> {displayedFacilities}
            {remainingText && <span className="text-gray-500 italic text-xs">{remainingText}</span>}
            </p>
        )}
        <div className="mt-auto pt-2"> {/* Đẩy phần trạng thái xuống dưới */}
            <p className="font-medium">
            Trạng thái:{' '}
            {available > 0 ? (
                <span className="text-green-600 font-semibold">Còn {available} chỗ</span>
            ) : (
                <span className="text-red-500 font-semibold">Hết chỗ</span>
            )}
            </p>
        </div>
      </div>
    </div>
  );

  // Chỉ cho phép click vào Link nếu phòng còn chỗ
  return available > 0 ? (
    <Link to={`/room/${id}`} className="block text-gray-800 transition-transform duration-200 h-full">
      {roomCardContent}
    </Link>
  ) : (
    <div className="h-full">{roomCardContent}</div> // Vẫn render card nhưng không có Link
  );
};

RoomItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID có thể là số từ DB
  image: PropTypes.string, // Cho phép null nếu không có ảnh
  name: PropTypes.string.isRequired,
  building: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  capacity: PropTypes.number.isRequired,
  floor: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
  facilities: PropTypes.arrayOf(PropTypes.string), // Cho phép null hoặc mảng rỗng
};

// Giá trị mặc định cho props (nếu cần, ví dụ facilities)
RoomItem.defaultProps = {
    image: null,
    facilities: [],
};

export default RoomItem;