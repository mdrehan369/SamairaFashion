import React from 'react'
import { Container, Input, Button, TextArea } from "../../components/index.js"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMessage } from '@fortawesome/free-solid-svg-icons';

function Contact() {

    const { register, handleSubmit } = useForm();

    const submit = (data) => {
        console.log(data);
    }

    return (
        <Container className='text-sm h-full flex items-start justify-start'>
            <div className='flex items-center justify-center w-[60%] h-auto'>
                <form onSubmit={handleSubmit(submit)} className='flex flex-col mt-20 items-start justify-around h-[90vh] w-[70%]' >
                    <h1 className='text-xl font-extrabold tracking-wide'>CONTACT</h1>
                    <div className='space-y-1'>
                        <p>Have a question or comment? </p>
                        <p>Use the form below to send us a message or contact us by mail at:</p>
                    </div>
                    <Input register={register} name='name' label='Name' placeholder='ex. John' className='w-full bg-transparent' />
                    <Input register={register} name='number' label='Phone Number' placeholder='ex. 1234567891' className='w-full bg-transparent' />
                    <Input register={register} name='email' label='Email' placeholder='ex. John123@example.com' className='w-full bg-transparent' />
                    <TextArea register={register} name='comment' label='comment' placeholder='ex. I want to collaborate...' className='w-full bg-transparent h-52' />
                    {/* <textarea {...register('comment')} la></textarea> */}
                    <Button type='submit' className='py-3 px-6 font-extrabold text-sm rounded-none'>SUBMIT CONTACT</Button>
                </form>
            </div>
            <div className='flex flex-col items-center justify-center w-[30%] h-[90vh]'>
                <div className='flex flex-col items-start justify-center gap-6'>
                    <h1 className='text-lg font-bold'>Get In Touch!</h1>
                    <div className='space-y-1'>
                        <p>We'd love to hear from you - please use the form to</p>
                        <p>send us your message or ideas.</p>
                    </div>
                    <div className='space-y-1'>
                        <p><FontAwesomeIcon icon={faMessage} className='mr-2' />TEXT: +97 15216 60581</p>
                        <p><FontAwesomeIcon icon={faEnvelope} className='mr-2' />samaira.shop1@gmail.com</p>
                    </div>
                    <div className='space-y-1'>
                        <p>29A/H/2 Palm Avenue,Kolkata 700019</p>
                        <p>.West Bengal, India</p>
                    </div>
                    <div className='w-full h-[2px] bg-gray-200'></div>
                    <div>Proprietor : Mohammad Bhupen</div>
                </div>
            </div>
        </Container>
    )
}

export default Contact