import React from 'react'
import { twMerge } from 'tailwind-merge'

function Container({
    children, 
    className,
    ...props
}) {
  return (
    <div className={twMerge(`w-[100vw] h-auto min-h-[90vh] dark:bg-slate-900`, className)} {...props}>
        {children}
    </div>
  )
}

export default Container