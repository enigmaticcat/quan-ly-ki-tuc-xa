// admin/src/App.jsx
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom'; // Thêm useLocation
import AddRoom from './pages/AddRoom';
import ListRoom from './pages/ListRoom';
import AddStudent from './pages/AddStudent';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentList from './pages/StudentList';
import StudentDetail from './pages/StudentDetail';
import EditStudent from './pages/EditStudent';
import EditRoom from './pages/EditRoom';
import ProtectedRoute from './components/ProtectedRoute'; // IMPORT ProtectedRoute
import ListRegistrations from './pages/ListRegistrations';
import CreateBill from './pages/CreateBill';
import ListBills from './pages/ListBills';
import AdminBillDetail from './pages/AdminBillDetail';
import ListForms from './pages/ListForms';
import AdminRoomDetail from './pages/AdminRoomDetail';
import ManageNotifications from './pages/ManageNotifications';

export const currency = "₫"; 

const App = () => {
  const location = useLocation();
  const isAdminLoggedIn = !!localStorage.getItem('adminToken'); // Kiểm tra trạng thái đăng nhập

  // Không hiển thị Navbar và Sidebar trên trang Login
  const showLayout = location.pathname !== '/';

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {showLayout && isAdminLoggedIn && <Navbar />} {/* Chỉ hiển thị Navbar nếu đã đăng nhập VÀ không ở trang login */}
      <hr className={showLayout && isAdminLoggedIn ? '' : 'hidden'}/>
      <div className={`flex w-full ${showLayout && isAdminLoggedIn ? '' : 'justify-center'}`}> {/* Căn giữa nếu chỉ có Login */}
        {showLayout && isAdminLoggedIn && <Sidebar />} {/* Chỉ hiển thị Sidebar nếu đã đăng nhập VÀ không ở trang login */}
        <div className={`${showLayout && isAdminLoggedIn ? 'w-[70%] mx-auto ml-[max(5vw,25px)]' : 'w-full'} my-8 text-gray-600 text-base`}>
          <Routes>
            <Route path='/' element={<Login />} />
            {/* Bọc các route admin bằng ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route path='/list-room' element={<ListRoom />} />
              <Route path='/add-room' element={<AddRoom />} />
              <Route path='/edit-room/:id' element={<EditRoom />} />
              <Route path='/list-student' element={<StudentList />} />
              <Route path='/add-student' element={<AddStudent />} />
              <Route path="/student/:id" element={<StudentDetail />} />
              <Route path="/edit-student/:id" element={<EditStudent />} />
              <Route path='/list-registrations' element={<ListRegistrations />} />
              <Route path='/create-bill' element={<CreateBill />} />
              <Route path='/list-bills' element={<ListBills />} />
              <Route path='/admin-bill-detail/:billId' element={<AdminBillDetail />} />
              <Route path='/list-forms' element={<ListForms />} />
              <Route path='/admin-room-detail/:roomId' element={<AdminRoomDetail />} />
              <Route path='/manage-notifications' element={<ManageNotifications />} />
              {/* Thêm các route admin khác vào đây */}
            </Route>
            {/* Bạn có thể thêm route 404 ở đây nếu muốn */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;