import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = (e) => {
    e.preventDefault();
    alert('Đăng nhập thử (chỉ giao diện)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Trang quản trị</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Địa chỉ email</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black" 
              type="email" 
              placeholder="nhap@email.com" 
              required 
            />
          </div>
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Mật khẩu</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black" 
              type="password" 
              placeholder="Nhập mật khẩu" 
              required 
            />
          </div>
          <button 
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
