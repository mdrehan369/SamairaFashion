import React from 'react'
import { Container, Input, Button, TextArea } from "../../components/index.js"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { faWhatsappSquare } from '@fortawesome/free-brands-svg-icons';

function Contact() {

    const { register, handleSubmit } = useForm();

    const submit = (data) => {
        console.log(data);
    }

    return (
        <Container className='text-sm h-full flex md:flex-row flex-col-reverse md:mt-0 mt-10 items-start justify-start animate-animate-appear'>
            <div className='flex items-center justify-center md:w-[60%] w-full h-auto'>
                <form onSubmit={handleSubmit(submit)} className='flex flex-col mt-20 items-start justify-around h-[90vh] md:w-[70%] w-[90%]' >
                    <h1 className='text-xl font-extrabold tracking-wide'>CONTACT</h1>
                    <div className='space-y-1'>
                        <p>Have a question or comment? </p>
                        <p>Use the form below to send us a message or contact us by mail at:</p>
                    </div>
                    <Input register={register} name='name' label='Name' placeholder='ex. John' className='w-full bg-transparent' />
                    <Input register={register} name='number' label='Phone Number' placeholder='ex. 1234567891' className='w-full bg-transparent' />
                    <Input register={register} name='email' label='Email' placeholder='ex. John123@example.com' className='w-full bg-transparent' />
                    <TextArea register={register} name='comment' label='Comment' placeholder='ex. I want to collaborate...' className='w-full bg-transparent h-52' />
                    <Button type='submit' className='py-3 px-6 font-extrabold text-sm rounded-none'>SUBMIT CONTACT</Button>
                </form>
            </div>
            <div className='flex flex-col items-center justify-center md:w-[30%] w-full md:h-[90vh] h-auto'>
                <div className='flex flex-col items-start justify-center gap-6'>
                    <h1 className='text-lg font-bold'>Get In Touch!</h1>
                    <div className='space-y-1'>
                        <p>We'd love to hear from you - please use the form to</p>
                        <p>send us your message or ideas.</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <a href='https://wa.me/+971521660581' target='__blank' className='hover:underline'><FontAwesomeIcon icon={faWhatsappSquare} className='mr-2 size-4' />Whatsapp: +97 15216 60581</a>
                        <a href='mailto:samaira.shop1@gmail.com' target='__blank' className='hover:underline'><FontAwesomeIcon icon={faEnvelope} className='mr-2 size-4' />samaira.shop1@gmail.com</a>
                    </div>
                    <div className='space-y-1'>
                        <p><FontAwesomeIcon icon={faLocationPin} className='mr-2 size-4' />Deira, Dubai. UAE</p>
                    </div>
                    <div className='w-full h-[2px] bg-gray-200'></div>
                    <div>Proprietor : Samaira Fashion</div>
                </div>
            </div>
        </Container>
    )
}

export default Contact