import React from 'react'
import { twMerge } from 'tailwind-merge'

function Container({
    children, 
    className,
    ...props
}) {
  return (
    <div className={twMerge(`w-[100vw] h-auto min-h-[90vh] dark:bg-primary-color dark:text-white`, className)} {...props}>
        {children}
    </div>
  )
}
// dark:bg-[#070F2B]
export default Container