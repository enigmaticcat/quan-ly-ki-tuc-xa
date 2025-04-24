import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        // <div className='flex bg-red-500 rounded-lg px-6 md:px-10 lg:px-20'>
            <div className='w-full relative'>
                <img 
                    className='w-full h-auto rounded-lg object-cover' 
                    src={assets.image_hust} 
                    alt="Header" 
                />
            </div>
        // </div>
    )
}

export default Header
