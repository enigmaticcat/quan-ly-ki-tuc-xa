// admin/src/components/Login.jsx
import {useState} from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!API_BASE_URL) {
        setError("Lỗi cấu hình: VITE_API_BASE_URL chưa được thiết lập.");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/account/login`, {
        email,
        password,
      });

      setLoading(false);
      if (response.data && response.data.status === 'success') {
        const { token, data } = response.data;
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
         

        alert('Đăng nhập thành công!');
        navigate('/list-room'); 
      } else {
        setError(response.data.message || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      setLoading(false);
      console.error("Lỗi đăng nhập:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Hiển thị lỗi từ server
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

    return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-xs"> {/* Thêm max-w-xs cho đẹp hơn */}
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Trang quản trị</h1> {/* Thêm text-gray-700 và mb-6 */}
        <form onSubmit={onSubmitHandler} className="space-y-4"> {/* Thêm space-y-4 */}
          <div> {/* Bọc input trong div để dễ style label nếu cần */}
            <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ email</label>
            <input
              id="email-login"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black shadow-sm" // Thêm shadow-sm
              type="email"
              placeholder="nhap@email.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              id="password-login"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-black shadow-sm" // Thêm shadow-sm
              type="password"
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>
          
          {/* Hiển thị lỗi - đảm bảo nằm trong form hoặc div cha của button */}
          {error && (
            <p className="text-red-500 text-xs text-center py-1">{error}</p>
          )} 
          
          <button
            className="w-full py-2.5 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60" // Cải thiện style
            type="submit"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;