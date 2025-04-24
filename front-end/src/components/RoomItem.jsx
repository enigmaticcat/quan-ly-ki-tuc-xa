import PropTypes from 'prop-types';

const RoomItem = ({ _id, image, name, building, gender, capacity, floor, facilities }) => {
  return (
    <div className="text-gray-700 cursor-default border rounded-lg p-4 shadow-sm h-[300px] flex flex-col justify-between">
      <img
        src={image}
        alt={name}
        className="w-full h-36 object-cover mb-2 rounded hover:scale-105 transition-transform duration-300"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold mb-1">{name}</p>
        <p className="text-xs text-gray-600 mb-1">Tòa: {building} – Tầng {floor}</p>
        <p className="text-xs text-gray-600 mb-1">Giới tính: {gender}</p>
        <p className="text-xs text-gray-600 mb-1">Sức chứa: {capacity} người</p>
        <p className="text-xs text-gray-600">Tiện nghi: {facilities.join(', ')}</p>
      </div>
    </div>
  );
};

RoomItem.propTypes = {
  id: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  building: PropTypes.string,
  gender: PropTypes.string,
  capacity: PropTypes.number,
  floor: PropTypes.number,
  facilities: PropTypes.arrayOf(PropTypes.string),
};

export default RoomItem;
