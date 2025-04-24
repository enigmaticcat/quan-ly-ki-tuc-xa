import React, { useState } from 'react';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // Basic validation for matching passwords
        if (!oldPassword) {
            setErrorMessage('Old password is required.');
            return;
        }

        if (!newPassword || !confirmPassword) {
            setErrorMessage('New password and confirmation are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('New password and confirm password do not match.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('Password changed successfully!');
    };

    return (
        <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>Change Password</p>
                <p>Please fill in the details below to update your password.</p>

                <div className='w-full'>
                    <p>Old Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='password'
                        placeholder='Enter old password'
                        onChange={(e) => setOldPassword(e.target.value)}
                        value={oldPassword}
                    />
                </div>
                <div className='w-full'>
                    <p>New Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='password'
                        placeholder='Enter new password'
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                    />
                </div>
                <div className='w-full'>
                    <p>Confirm New Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='password'
                        placeholder='Confirm new password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                </div>
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                {successMessage && <p className='text-green-500'>{successMessage}</p>}
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    Change Password
                </button>
            </div>
        </form>
    );
};

export default ChangePassword;
