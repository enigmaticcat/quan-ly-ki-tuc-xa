import React, { useState } from 'react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!oldPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu cũ.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu mới và xác nhận.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận không khớp.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Đổi mật khẩu thành công!');
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">Đổi mật khẩu</p>
        <p>Vui lòng điền thông tin bên dưới để cập nhật mật khẩu.</p>

        <div className="w-full">
          <p>Mật khẩu cũ</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            placeholder="Nhập mật khẩu cũ"
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
          />
        </div>
        <div className="w-full">
          <p>Mật khẩu mới</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            placeholder="Nhập mật khẩu mới"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
          />
        </div>
        <div className="w-full">
          <p>Xác nhận mật khẩu mới</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Cập nhật mật khẩu
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
