import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RoomCollection from "./pages/RoomCollection";
import Login from './pages/Login';
import NavBar from "./components/NavBar";
import MyProfile from './pages/MyProfile';
import Footer from "./components/Footer";
import ChangePassword from "./pages/ChangePassword";
import Checkout from "./pages/Checkout"
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room-collection' element={<RoomCollection />} />
        <Route path='/room-collection/:_id' element={<RoomCollection />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/check-out' element={<Checkout />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App