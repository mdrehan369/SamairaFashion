import React from 'react'

function Footer() {
  return (
    <footer className='w-full h-[30vh] text-center bg-black text-gray-400'>
      
        <div className=' flex p-4 ml-11 '>

          <div className='flex flex-col h-[40%] items-start justify-between w-1/3'>
            <h1 className='text-5xl font-bold m-3 text-gray-400'>
              <span className='text-yellow-600 '>सुकून</span> Space
            </h1>
           <div id="phone" className=' flex m-2'>
              <div>
              <i class="fa-solid fa-phone text-2xl mr-2"></i>
              </div>
              <div>
                 (+91) 6290197369
              </div>
           </div>
           <div id="gmail" className='flex m-2'>
              <div>
              <i class="fa-regular fa-envelope text-2xl mr-2"></i>
              </div>
              <div>
                SukoonSpace@company.com
              </div>
           </div>
          </div>
          <div className=' w-52'>
            <p className=' text-xl text-yellow-600 text-left '>Contributors:</p>
            <ul><li className=' text-lg my-2 text-left'>Md Rehan</li>
            <li className=' text-lg my-2 text-left'>Vishal Kumar</li>
            <li className=' text-lg my-2 text-left'>Md Asiful Ameen</li>
            <li className=' text-lg my-2 text-left'>Khushi Srivastava</li></ul>
          </div>
          <div className='w-1/3 ml-64 flex flex-col items-start'>
            <div className=' text-2xl text-yellow-600'>About Sukoon Space</div>
            <div className='text-left '>A mental health care webpage offers resources, support, and information on various mental health conditions. It provides access to therapy, medication management, and self-care techniques, fostering understanding and promoting well-being for individuals seeking mental health support.</div>
            <div id="logo" className='flex items-center justify-center'>
              <i class="fa-brands fa-github text-2xl m-2"></i>
              <i class="fa-brands fa-square-x-twitter text-2xl m-2"></i>
              <i class="fa-brands fa-linkedin text-2xl m-2"></i>
              <i class="fa-brands fa-facebook text-2xl m-2"></i>
            </div>
          </div>

        </div>
    </footer>
  )
}

export default Footer