import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
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

export const currency = "₫"; 

const App = () => {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className='flex w-full'>
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/add-room' element={<AddRoom />} />
            <Route path='/list-room' element={<ListRoom />} />
            <Route path='/add-student' element={<AddStudent />} />
            <Route path='/list-student' element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetail />} />
            <Route path="/edit-student/:id" element={<EditStudent />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
