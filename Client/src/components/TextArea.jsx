import React from 'react'
import { twMerge } from 'tailwind-merge'

function TextArea({
  register,
  name,
  className = '',
  label = '',
  errors = null,
  ...props
}) {
  return (
    <div className='flex flex-col items-start justify-start w-[100%] h-fit'>
      <label htmlFor={name} className='text-sm dark:text-white h-fit font-medium text-stone-700'>{label}</label>
      <textarea
        className={twMerge(`w-full m-0 h-full p-5 bg-gray-100 shadow-sm dark:bg-secondary-color rounded-sm resize-none border-[1px] dark:border-transparent focus:dark:border-gray-400 focus:outline-none focus:border-black border-gray-400`, className)}
        {...register(name)}
        {...props}
        id={name}
      />
      {
        errors &&
        errors[`${name}`] &&
        <span className='text-xs bg-[#ff4e4e] dark:bg-[#8d1a1a] text-white py-1 px-2 mt-1 rounded-md'>{errors[`${name}`] && errors[`${name}`].message}</span>}
    </div>
  )
}

export default TextArea