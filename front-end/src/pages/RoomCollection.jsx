import { useState, useEffect } from 'react';
import { assets, rooms as allRooms } from '../assets/assets.js';
import Title from '../components/Title'; 
import RoomItem from '../pages/RoomItem.jsx';

const RoomCollection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [capacityFilter, setCapacityFilter] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState([]);
  const [floorFilter, setFloorFilter] = useState([]);
  const [sortType, setSortType] = useState('default');
  const [filteredRooms, setFilteredRooms] = useState(allRooms);

  const toggleFilter = (setter, current) => (e) => {
    const value = e.target.value;
    current.includes(value)
      ? setter(current.filter((item) => item !== value))
      : setter([...current, value]);
  };

  const applyFilters = () => {
    let filtered = allRooms;

    if (buildingFilter.length > 0) {
      filtered = filtered.filter((room) => buildingFilter.includes(room.building));
    }

    if (genderFilter.length > 0) {
      filtered = filtered.filter((room) => genderFilter.includes(room.gender));
    }

    if (capacityFilter.length > 0) {
      filtered = filtered.filter((room) =>
        capacityFilter.includes(room.capacity.toString())
      );
    }

    if (facilityFilter.length > 0) {
      filtered = filtered.filter((room) =>
        facilityFilter.every((f) => room.facilities.includes(f))
      );
    }

    if (floorFilter.length > 0) {
      filtered = filtered.filter((room) =>
        floorFilter.includes(room.floor.toString())
      );
    }

    if (sortType === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.capacity - b.capacity);
    } else if (sortType === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.capacity - a.capacity);
    }

    setFilteredRooms(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [buildingFilter, genderFilter, capacityFilter, facilityFilter, floorFilter, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-52">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-red-500 my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          />
        </p>

        {/* BUILDING FILTER */}
        <FilterSection title="TÒA NHÀ" show={showFilter}>
          {['B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B13', 'B5b', 'B13b'].map((b) => (
            <Checkbox key={b} label={b} value={b} onChange={toggleFilter(setBuildingFilter, buildingFilter)} />
          ))}
        </FilterSection>

        {/* GENDER FILTER */}
        <FilterSection title="GIỚI TÍNH" show={showFilter}>
          {['Nam', 'Nữ'].map((g) => (
            <Checkbox key={g} label={g} value={g} onChange={toggleFilter(setGenderFilter, genderFilter)} />
          ))}
        </FilterSection>

        {/* CAPACITY FILTER */}
        <FilterSection title="SỨC CHỨA" show={showFilter}>
          {[4, 6, 8].map((c) => (
            <Checkbox key={c} label={`${c} người`} value={c} onChange={toggleFilter(setCapacityFilter, capacityFilter)} />
          ))}
        </FilterSection>

        {/* FACILITY FILTER */}
        <FilterSection title="TIỆN NGHI" show={showFilter}>
          {['Máy lạnh', 'Tủ đồ', 'Wifi', 'WC riêng'].map((f) => (
            <Checkbox key={f} label={f} value={f} onChange={toggleFilter(setFacilityFilter, facilityFilter)} />
          ))}
        </FilterSection>

        {/* FLOOR FILTER */}
        <FilterSection title="TẦNG" show={showFilter}>
          {[1, 2, 3, 4, 5].map((f) => (
            <Checkbox key={f} label={`Tầng ${f}`} value={f} onChange={toggleFilter(setFloorFilter, floorFilter)} />
          ))}
        </FilterSection>
      </div>

      {/* ROOM LIST */}
      <div className="flex-1">
        <div className="flex justify-between text-sm sm:text-xl lg:text-2xl mb-4">
          <Title text1="DANH SÁCH" text2="PHÒNG" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="border border-gray-300 text-sm px-2"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="low-high">Sắp xếp: Sức chứa tăng dần</option>
            <option value="high-low">Sắp xếp: Sức chứa giảm dần</option>
          </select>
        </div>

        <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
          {filteredRooms.map((room) => (
            <RoomItem
              key={room._id}
              id={room._id}
              image={room.image}
              name={room.name}
              building={room.building}
              gender={room.gender}
              capacity={room.capacity}
              floor={room.floor}
              facilities={room.facilities}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Checkbox component
const Checkbox = ({ label, value, onChange }) => (
  <label className="flex gap-2 text-sm text-gray-700">
    <input type="checkbox" className="w-3" value={value} onChange={onChange} />
    {label}
  </label>
);

// Filter wrapper
const FilterSection = ({ title, children, show }) => (
  <div className={`border border-gray-300 pl-5 py-3 mt-5 ${show ? '' : 'hidden'} sm:block`}>
    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-500">{title}</p>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

export default RoomCollection;
