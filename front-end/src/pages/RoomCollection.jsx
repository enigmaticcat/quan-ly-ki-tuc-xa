// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\front-end\src\pages\RoomCollection.jsx
import { useState, useEffect } from 'react';
import { assets } from '../assets/assets.js';
import Title from '../components/Title'; 
import RoomItem from './RoomItem.jsx'; // Hoặc ../components/RoomItem.jsx tùy vị trí
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes

const BACKEND_STATIC_URL = 'http://localhost:5000';

// --- Checkbox Component ---
const Checkbox = ({ label, value, onChange, checked }) => (
  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
    <input 
      type="checkbox" 
      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" // Kích thước lớn hơn chút
      value={value} 
      onChange={onChange} 
      checked={checked} 
    />
    {label}
  </label>
);
Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

// --- FilterSection Component ---
const FilterSection = ({ title, children, show }) => (
  <div className={`border border-gray-200 rounded-md px-4 py-4 mt-5 ${show ? '' : 'hidden'} sm:block bg-white shadow-sm`}> {/* Sửa padding */}
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">{title}</p> {/* Sửa màu và size */}
    <div className="flex flex-col gap-2.5">{children}</div>
  </div>
);
FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
};


const RoomCollection = () => {
  const [allRoomsFromAPI, setAllRoomsFromAPI] = useState([]); // Đổi tên để phân biệt với filteredRooms
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFilter, setShowFilter] = useState(false); // Mặc định ẩn filter trên mobile
  const [buildingFilter, setBuildingFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [capacityFilter, setCapacityFilter] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState([]);
  const [floorFilter, setFloorFilter] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'full'
  const [sortType, setSortType] = useState('default');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
      setLoading(false);
      return;
    }
    const fetchAllRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/room/getAllRoom`);
        if (response.data && response.data.status === 'success') {
          // API trả về: id, room_number, building_name, gender, capacity, floor, image, accommodations, occupied_slots, available_slots
          setAllRoomsFromAPI(response.data.data); 
        } else {
          setError(response.data.message || "Không thể tải danh sách phòng.");
          setAllRoomsFromAPI([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Lỗi server khi tải phòng.");
        setAllRoomsFromAPI([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRooms();
  }, [API_BASE_URL]);

  // Logic filter và sort được áp dụng khi allRoomsFromAPI hoặc các state filter thay đổi
  useEffect(() => {
    let tempFilteredRooms = [...allRoomsFromAPI];

    if (buildingFilter.length > 0) {
      tempFilteredRooms = tempFilteredRooms.filter((room) => buildingFilter.includes(room.building_name));
    }
    if (genderFilter.length > 0) {
      tempFilteredRooms = tempFilteredRooms.filter((room) => genderFilter.includes(room.gender));
    }
    if (capacityFilter.length > 0) {
      tempFilteredRooms = tempFilteredRooms.filter((room) => capacityFilter.includes(String(room.capacity)));
    }
    if (facilityFilter.length > 0) {
      tempFilteredRooms = tempFilteredRooms.filter((room) =>
        facilityFilter.every((f) => (room.accommodations || []).includes(f))
      );
    }
    if (floorFilter.length > 0) {
      tempFilteredRooms = tempFilteredRooms.filter((room) => floorFilter.includes(String(room.floor)));
    }
    // Filter theo tình trạng còn phòng
    if (availabilityFilter === 'available') {
        tempFilteredRooms = tempFilteredRooms.filter(room => room.available_slots > 0);
    } else if (availabilityFilter === 'full') {
        tempFilteredRooms = tempFilteredRooms.filter(room => room.available_slots === 0);
    }


    // Sorting
    if (sortType === 'capacity_asc') { // Sắp xếp theo sức chứa tăng dần
      tempFilteredRooms.sort((a, b) => a.capacity - b.capacity);
    } else if (sortType === 'capacity_desc') { // Sắp xếp theo sức chứa giảm dần
      tempFilteredRooms.sort((a, b) => b.capacity - a.capacity);
    } else if (sortType === 'availability_desc') { // Sắp xếp theo số chỗ trống nhiều nhất
        tempFilteredRooms.sort((a, b) => b.available_slots - a.available_slots);
    }
    // Mặc định (hoặc 'default') có thể là theo tên tòa, số phòng (đã làm ở backend ORDER BY)

    setFilteredRooms(tempFilteredRooms);
  }, [allRoomsFromAPI, buildingFilter, genderFilter, capacityFilter, facilityFilter, floorFilter, availabilityFilter, sortType]);


  const toggleFilterArray = (setter, currentFilterState) => (e) => {
    const { value, checked } = e.target;
    setter(
      checked
        ? [...currentFilterState, value]
        : currentFilterState.filter((item) => item !== value)
    );
  };
  
  const uniqueBuildings = [...new Set(allRoomsFromAPI.map(room => room.building_name))].sort();
  const uniqueGenders = [...new Set(allRoomsFromAPI.map(room => room.gender))].sort();
  const uniqueCapacities = [...new Set(allRoomsFromAPI.map(room => room.capacity))].sort((a,b) => a-b);
  const uniqueFloors = [...new Set(allRoomsFromAPI.map(room => room.floor))].sort((a,b) => a-b);
  const allPossibleFacilities = ['Máy lạnh', 'Wifi', 'Tủ đồ', 'WC riêng', 'Ban công', 'Bếp nhỏ']; // Giữ hardcode hoặc fetch từ đâu đó


  if (loading) return <p className="p-10 text-center text-gray-600">Đang tải danh sách phòng...</p>;
  if (error) return <p className="p-10 text-center text-red-500">Lỗi: {error}</p>;

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t border-gray-200">
      {/* Filter Sidebar */}
      <div className="w-full sm:w-60 md:w-64 flex-shrink-0">
        <div className="flex justify-between items-center sm:hidden mb-4 px-1">
            <p className='text-lg font-semibold text-gray-700'>Bộ lọc</p>
            <button
                onClick={() => setShowFilter(!showFilter)}
                className="text-primary p-2 rounded-md hover:bg-primary/10"
                aria-expanded={showFilter}
                aria-controls="filter-panel"
            >
            {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'} 
            <img src={assets.dropdown_icon} alt="" className={`inline-block h-3 ml-1.5 transform transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`}/>
            </button>
        </div>
        
        <div id="filter-panel" className={`${showFilter ? 'block animate-fadeIn' : 'hidden'} sm:block space-y-5`}> {/* Thêm space-y */}
            <FilterSection title="TÒA NHÀ">
            {uniqueBuildings.map((b) => (
                <Checkbox key={b} label={b} value={b} onChange={toggleFilterArray(setBuildingFilter, buildingFilter)} checked={buildingFilter.includes(b)} />
            ))}
            </FilterSection>
            
            <FilterSection title="TÌNH TRẠNG PHÒNG">
                <Checkbox label="Còn chỗ" value="available" onChange={() => setAvailabilityFilter(prev => prev === 'available' ? 'all' : 'available')} checked={availabilityFilter === 'available'} />
                <Checkbox label="Hết chỗ" value="full" onChange={() => setAvailabilityFilter(prev => prev === 'full' ? 'all' : 'full')} checked={availabilityFilter === 'full'} />
            </FilterSection>

            {/* ... các FilterSection khác (Gender, Capacity, Facility, Floor) tương tự, nhớ truyền checked prop ... */}
            <FilterSection title="GIỚI TÍNH">
            {uniqueGenders.map((g) => (
                <Checkbox key={g} label={g} value={g} onChange={toggleFilterArray(setGenderFilter, genderFilter)} checked={genderFilter.includes(g)} />
            ))}
            </FilterSection>

            <FilterSection title="SỨC CHỨA">
            {uniqueCapacities.map((c) => (
                <Checkbox key={c} label={`${c} người`} value={String(c)} onChange={toggleFilterArray(setCapacityFilter, capacityFilter)} checked={capacityFilter.includes(String(c))} />
            ))}
            </FilterSection>

            <FilterSection title="TIỆN NGHI">
            {allPossibleFacilities.map((f) => (
                <Checkbox key={f} label={f} value={f} onChange={toggleFilterArray(setFacilityFilter, facilityFilter)} checked={facilityFilter.includes(f)} />
            ))}
            </FilterSection>

            <FilterSection title="TẦNG">
            {uniqueFloors.map((f) => (
                <Checkbox key={f} label={`Tầng ${f}`} value={String(f)} onChange={toggleFilterArray(setFloorFilter, floorFilter)} checked={floorFilter.includes(String(f))} />
            ))}
            </FilterSection>
        </div>
      </div>

      {/* ROOM LIST */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-baseline text-sm sm:text-base mb-6">
          <Title />
          <div className="flex items-center gap-4 mt-3 sm:mt-0 w-full sm:w-auto">
            <p className="text-gray-600 text-xs whitespace-nowrap">Hiển thị {filteredRooms.length} phòng</p>
            <select
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                className="border border-gray-300 text-xs px-3 py-2 rounded-md focus:ring-primary focus:border-primary"
            >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="capacity_asc">Sức chứa: Thấp đến Cao</option>
                <option value="capacity_desc">Sức chứa: Cao đến Thấp</option>
                <option value="availability_desc">Ưu tiên: Còn nhiều chỗ</option>
            </select>
          </div>
        </div>

        {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"> {/* Điều chỉnh grid */}
            {filteredRooms.map((room) => (
                <RoomItem
                    key={room.id}
                    id={room.id}
                    image={room.image} // RoomItem sẽ xử lý `${BACKEND_STATIC_URL}/uploads/${room.image}`
                    name={room.room_number}
                    building={room.building_name}
                    gender={room.gender}
                    capacity={room.capacity}
                    floor={room.floor}
                    facilities={room.accommodations || []}
                    available={room.available_slots} // Truyền thẳng available_slots từ API
                />
            ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow">
                <p className="text-xl mb-2">:(</p>
                <p>Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.</p>
                <p className="text-xs mt-1">Hãy thử thay đổi các tiêu chí lọc.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoomCollection;