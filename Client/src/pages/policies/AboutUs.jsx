// import React from 'react'

// function AboutUs() {
//     return (
//         <div className=' prose prose-xl h-[50vh]'>
//             <div dangerouslySetInnerHTML={{ __html: `<div class="page-width page-width--narrow">\n<div class="container">\n<h1 class="main-page-title page-header">About Us</h1>\n<div class="rte">\n<p><strong>I, Mohammad Bhupen, Started Samaira back in</strong>&nbsp;2015.From then onwards there was no looking back.</p>\n<p>We enjoy doing what we do everyday, each day,24/7 and 365 days a year. Yes we make Abayas and Hijabs .<strong>Manufacturing Abayas</strong>&nbsp;is what we are really good at.</p>\n<p>Catering Customers around the Globe since its inception.&nbsp;<strong>We Deliver in Retail and Wholesale quantity.</strong></p>\n<p>Do connect with us through our Email | Contact no | Live chat options for a One to One buildup.</p>\n<p>Support us by your Like, Share and Follow our Social media handle. Subscribe with us by leaving your email and stay updated with All offers and promotions.</p>\n<p><strong>Enjoy the&nbsp;Welcome Discount&nbsp;for all when you subscribe with us.No Conditions Apply.<br><br>Our location:&nbsp;29A/H/2 Palm Avenue,Kolkata 700019, West Bengal, India.</strong></p>\n<p>Happy Shopping Customers.</p>\n<p><strong>Team Samaira Fashion.</strong></p>\n</div>\n</div>\n</div>` }} className='prose prose-xl'>
//             </div>
//         </div>
//     )
// }

// export default AboutUs

import React from 'react';

const AboutUs = () => {
    return (
        <div className="text-sm font-[400]">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold uppercase mb-6">ABOUT US</h2>
                    <p className="mb-4">
                        <span className="font-bold">I, Mohammad Bhupen,</span> Started Samaira back in 2015.From then onwards there was no looking back.
                    </p>
                    <p className="mb-4">
                        We enjoy doing what we do everyday, each day,24/7 and 365 days a year. Yes we make Abayas and Hijabs. <span className="font-bold">Manufacturing Abayas is what we are really good at.</span>
                    </p>
                    <p className="mb-4">
                        Catering Customers around the Globe since its inception. <span className="font-bold">We Deliver in Retail and Wholesale quantity.</span>
                    </p>
                    <p className="mb-4">
                        Do connect with us through our Email | Contact no | Live chat options for a One to One buildup.
                    </p>
                    <p className="mb-4">
                        Support us by your like, Share and Follow our Social media handle. Subscribe with us by leaving your email and stay updated with All offers and promotions.
                    </p>
                    <p className="mb-4">
                        <span className="font-bold">Enjoy the Welcome Discount for all when you subscribe with us.No Conditions Apply.</span>
                    </p>
                    <p className="mb-4">Our location: <span className="font-bold">29A/H/2 Palm Avenue,Kolkata 700019, West Bengal, India.</span></p>
                    <p className="mb-4">Happy Shopping Customers.</p>
                    <span className='font-bold'>Team Samaira Fashion.</span>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;