import React from 'react'
import { twMerge } from 'tailwind-merge'

function Container({
    children, 
    className,
    ...props
}) {
  return (
    <div className={twMerge(`w-[100vw] h-auto relative min-h-[90vh] dark:bg-primary-color dark:text-white`, className)} {...props}>
      {/* <img src={bg} alt="bg" className='absolute top-' /> */}
        {children}
    </div>
  )
}

export default Container