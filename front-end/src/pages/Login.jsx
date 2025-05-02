import React, { useState } from 'react';

const Login = () => {
  const [state, setState] = useState('Đăng ký');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onsubmitHandler = async (event) => {
    event.preventDefault();

    const payload = { email, password };
    if (state === 'Đăng ký') payload.name = name;

    try {
      const response = await fetch(`/api/auth/${state === 'Đăng ký' ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.errCode !== 0) {
        setErrorMessage(data.message);
      } else {
        console.log('Thành công:', data.user);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onsubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập'}</p>
        <p>Vui lòng {state === 'Đăng ký' ? 'đăng ký' : 'đăng nhập'} để tiếp tục sử dụng hệ thống</p>

        {state === 'Đăng ký' && (
          <div className="w-full">
            <p>Họ và tên</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Mật khẩu</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          {state === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập'}
        </button>
        {state === 'Đăng ký' ? (
          <p>
            Đã có tài khoản?{' '}
            <span onClick={() => setState('Đăng nhập')} className="text-primary underline cursor-pointer">
              Đăng nhập
            </span>
          </p>
        ) : (
          <p>
            Chưa có tài khoản?{' '}
            <span onClick={() => setState('Đăng ký')} className="text-primary underline cursor-pointer">
              Đăng ký ngay
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
