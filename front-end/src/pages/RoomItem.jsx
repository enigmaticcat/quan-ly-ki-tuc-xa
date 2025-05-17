import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const RoomItem = ({ id, image, name, building, gender, capacity, floor, facilities, available }) => {
  const displayedFacilities = facilities.slice(0, 2).join(', ');
  const remaining = facilities.length > 2 ? ` +${facilities.length - 2} tiện nghi khác` : '';

  const RoomCard = (
    <div className={`border rounded-xl overflow-hidden shadow-sm transition h-full bg-white ${available === 0 ? 'opacity-50' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4 text-sm space-y-1">
        <h3 className="font-semibold text-base truncate">{name}</h3>
        <p><b>Tòa:</b> {building}</p>
        <p><b>Giới tính:</b> {gender === 'Nam' ? '👨 Nam' : '👩 Nữ'}</p>
        <p><b>Sức chứa:</b> {capacity} người</p>
        <p><b>Tầng:</b> {floor}</p>
        <p title={facilities.join(', ')}>
          <b>Tiện nghi:</b> {displayedFacilities}
          {remaining && <span className="text-gray-500 italic">{remaining}</span>}
        </p>
        <p>
          <b>Trạng thái:</b>{' '}
          {available > 0 ? (
            <span className="text-green-600">Còn {available} chỗ</span>
          ) : (
            <span className="text-red-500">Hết chỗ</span>
          )}
        </p>
      </div>
    </div>
  );

  return available > 0 ? (
    <Link to={`/room/${id}`} className="block text-gray-800 transition-transform duration-200">
      {RoomCard}
    </Link>
  ) : (
    <div className="cursor-not-allowed">{RoomCard}</div>
  );
};

RoomItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  building: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  capacity: PropTypes.number.isRequired,
  floor: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
  facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoomItem;
