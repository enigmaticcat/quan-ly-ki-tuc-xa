import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RoomItem = ({ id, image, name, building, gender, capacity, floor, facilities }) => {
  return (
    <Link to={`/room/${id}`} className="block text-gray-800 hover:shadow-md transition">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition h-full bg-white">
        <img src={image} alt={name} className="w-full h-40 object-cover" />
        <div className="p-4 text-sm space-y-1">
          <h3 className="font-semibold text-base truncate">{name}</h3>
          <p><b>Tòa:</b> {building}</p>
          <p><b>Giới tính:</b> {gender}</p>
          <p><b>Sức chứa:</b> {capacity} người</p>
          <p><b>Tầng:</b> {floor}</p>
          <p><b>Tiện nghi:</b> {facilities.slice(0, 2).join(', ')}{facilities.length > 2 && '...'}</p>
        </div>
      </div>
    </Link>
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
  facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoomItem;
