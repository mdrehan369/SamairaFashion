import React from 'react'
import { twMerge } from 'tailwind-merge'

function Container({
    children, 
    className
}) {
  return (
    <div className={twMerge(`w-[100vw] h-auto min-h-[90vh] dark:bg-slate-900`, className)}>
        {children}
    </div>
  )
}

export default Container