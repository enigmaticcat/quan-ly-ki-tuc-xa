import React, { useState } from 'react';

const Login = () => {
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onsubmitHandler = async (event) => {
        event.preventDefault();

        const payload = { email, password };
        if (state === 'Sign Up') payload.name = name;

        try {
            const response = await fetch(`/api/auth/${state === 'Sign Up' ? 'signup' : 'login'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.errCode !== 0) {
                setErrorMessage(data.message); // Hiển thị lỗi
            } else {
                // Xử lý khi đăng nhập/thành công
                console.log('Success:', data.user);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };

    return (
        <form className='min-h-[80vh] flex items-center' onSubmit={onsubmitHandler}>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
                <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

                {state === 'Sign Up' && (
                    <div className='w-full'>
                        <p>Full Name</p>
                        <input
                            className='border border-zinc-300 rounded w-full p-2 mt-1'
                            type='text'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                )}

                <div className='w-full'>
                    <p>Email</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    {state === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>
                {state === 'Sign Up' ? (
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p>
                        Create a new account?{' '}
                        <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
