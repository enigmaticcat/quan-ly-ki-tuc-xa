import { useState, useContext } from 'react'; // Thêm React, useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // Import context

const Login = () => {
  const [state, setState] = useState('Đăng nhập'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { login: contextLogin } = useContext(AppContext); // Lấy hàm login từ context

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!API_BASE_URL) {
        setErrorMessage("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
        setLoading(false);
        return;
    }

    let url = '';
    let payload = {};

    if (state === 'Đăng ký') {
      url = `${API_BASE_URL}/account/register`;
      payload = { fullname, email, password };
    } else { 
      url = `${API_BASE_URL}/account/login`;
      payload = { email, password };
    }

    try {
      const response = await axios.post(url, payload);
      setLoading(false);

      if (response.data && response.data.status === 'success') {
        if (state === 'Đăng nhập') {
          const { token, data } = response.data;
          if (data && data.user) { // Kiểm tra data.user tồn tại
            contextLogin(data.user, token); // Gọi hàm login của context
            alert('Đăng nhập thành công!');
            navigate('/'); 
          } else {
            setErrorMessage('Dữ liệu người dùng không hợp lệ từ server.');
          }
        } else { 
          alert(response.data.message || 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
          setState('Đăng nhập');
          setFullname('');
          setEmail('');
          setPassword('');
        }
      } else {
        setErrorMessage(response.data.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      setLoading(false);
      console.error(`Lỗi khi ${state}:`, error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <form className="min-h-[calc(100vh-200px)] flex items-center justify-center py-10" onSubmit={onsubmitHandler}>
      <div className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-zinc-700 text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-gray-800">{state}</p>
        <p className="text-gray-600">Vui lòng {state === 'Đăng ký' ? 'nhập thông tin để đăng ký' : 'đăng nhập'} để tiếp tục.</p>

        {state === 'Đăng ký' && (
          <div className="w-full">
            <label className="block mb-1 font-medium">Họ và tên <span className="text-red-500">*</span></label>
            <input
              className="border border-gray-300 rounded w-full p-2.5 mt-1 focus:ring-primary focus:border-primary"
              type="text"
              name="fullname"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              placeholder="Nhập họ và tên của bạn"
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="w-full">
          <label className="block mb-1 font-medium">Email <span className="text-red-500">*</span></label>
          <input
            className="border border-gray-300 rounded w-full p-2.5 mt-1 focus:ring-primary focus:border-primary"
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="nhap@email.com"
            required
            disabled={loading}
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 font-medium">Mật khẩu <span className="text-red-500">*</span></label>
          <input
            className="border border-gray-300 rounded w-full p-2.5 mt-1 focus:ring-primary focus:border-primary"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Nhập mật khẩu"
            required
            disabled={loading}
          />
        </div>
        {errorMessage && <p className="text-red-500 text-center w-full">{errorMessage}</p>}
        <button 
            className="bg-primary text-white w-full py-2.5 rounded-md text-base hover:bg-opacity-90 transition disabled:opacity-70"
            type="submit"
            disabled={loading}
        >
          {loading ? 'Đang xử lý...' : (state === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập')}
        </button>
        {state === 'Đăng ký' ? (
          <p className="w-full text-center">
            Đã có tài khoản?{' '}
            <span onClick={() => { setState('Đăng nhập'); setErrorMessage(''); }} className="text-primary underline cursor-pointer font-medium">
              Đăng nhập tại đây
            </span>
          </p>
        ) : (
          <p className="w-full text-center">
            Chưa có tài khoản?{' '}
            <span onClick={() => { setState('Đăng ký'); setErrorMessage(''); }} className="text-primary underline cursor-pointer font-medium">
              Đăng ký ngay
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;