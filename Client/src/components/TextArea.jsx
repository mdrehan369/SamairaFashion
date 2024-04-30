import React from 'react'

function TextArea({
    register,
    name,
    className='',
    label='',
    ...props
}) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
        <textarea
        className={"w-[25vw] m-4 h-[20vh] p-4 bg-gray-100 shadow-lg dark:bg-slate-800 rounded-lg resize-none " + className}
        {...register(name)}
        {...props}
        id={name}
        />
    </div>
  )
}

export default TextArea