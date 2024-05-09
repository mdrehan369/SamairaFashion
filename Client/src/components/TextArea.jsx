import React from 'react'
import { twMerge } from 'tailwind-merge'

function TextArea({
    register,
    name,
    className='',
    label='',
    ...props
}) {
  return (
    <div className='flex flex-col items-start justify-start w-[100%] h-fit'>
      <label htmlFor={name} className='text-md h-fit font-medium text-stone-700'>{label}</label>
        <textarea
        className={twMerge(`w-full m-0 h-full p-2 bg-gray-100 shadow-sm dark:bg-slate-800 rounded-sm resize-none border-[1px] focus:outline-none focus:border-black border-gray-400`, className)}
        {...register(name)}
        {...props}
        id={name}
        />
    </div>
  )
}

export default TextArea