import React, { useState } from 'react';
import { Container, Input, Button, TextArea, LightSpinner } from "../../components/index.js";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from 'react-redux';

function AddProduct() {

	const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
		defaultValues: {
			description: "Style : Straight / A-Line (as per pic)\nSize Available : 52,54,56,58,60,62\nMaterial : Premium Zoom/Nida Fabric+High Qualty (as in pic)\nChiffon Fabric: Non-Stretch\nSleeve Length : Long Sleeves\nBelt: As per pic(If any)\nSheila: Yes | As per Pic (Free)\nCare Instructions : Dry Clean\nIroning: Steam Iron before wearing for best look."
		}
	});
	const [loader, setLoader] = useState(false);
	const [isRupee, setIsRupee] = useState(true);
	const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
	const [onTop, setOnTop] = useState(false);
	const [msg, setMsg] = useState(false);

	const handleMsg = () => {
		setMsg(true);
		setTimeout(() => {
			setMsg(false);
		}, 3000)
	}

	const submit = async (data) => {

		let isError = false;
		Object.keys(data).map((key) => {
			if (data[key] === '') {
				setError(key, { message: "Please Fill Out This Field", type: "required" }, { shouldFocus: true });
				isError = true;
			}
		});

		if (data.images.length === 0) {
			setError("images", { message: "Please Fill Atleast One Image", type: "required" }, { shouldFocus: true });
			return;
		}

		if (isError) return;

		setLoader(true);
		try {
			const formData = new FormData(document.getElementsByTagName("form")[0]);
			formData.append("onTop", onTop);

			if (!isRupee) {
				const dirhamValue = dirham_to_rupees || 22;
				formData.set("price", Math.round(Number(formData.get("price")) * dirhamValue))
				formData.set("comparePrice", Math.round(Number(formData.get("comparePrice")) * dirhamValue))

			}

			await axios.post("/api/v1/products/product", formData, {
				baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
			});

			// reset();
			handleMsg();
		} catch (e) {
			console.log(e);
		} finally {
			setLoader(false);
		}
	}

	return (
		<Container className='flex items-center justify-center h-full'>
			{
				msg &&
				<div className='bg-green-500 absolute top-0 left-0 right-0 animate-animate-appear p-2 text-center'>
					Product Added Successfully!
				</div>
			}
			<form onSubmit={handleSubmit(submit)} className='w-[60%] flex flex-col items-center justify-center gap-4 h-full' encType='multipart/form-data'>

				<Input type='text' name='title' label='Title' register={register} placeholder='ex. Black Abaya With ...' className='w-full bg-gray-50 border-gray-300 rounded-lg' errors={errors} />
				<TextArea type='text' name='description' label='Description' register={register} placeholder='ex. Style with this brand new abaya ...' className='p-2 text-sm bg-gray-50 border-gray-300 rounded-lg h-24' errors={errors} />


				<div className="w-full flex items-center justify-between gap-4">
					<div className='w-[100%]'>
						<label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
						<select {...register("category")} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
							<option value=''>Choose a category</option>
							<option value="Umbrella">Umbrella</option>
							<option value="Straight">Straight</option>
							<option value="Tyedye">Tye Dye</option>
							<option value="Farasha">Farasha</option>
						</select>
						{
							errors &&
							errors[`category`] &&
							<span className='text-xs bg-[#ff4e4e] dark:bg-[#8d1a1a] text-white py-1 px-2 rounded-md mt-4'>{errors[`category`] && errors[`category`].message}</span>
						}
					</div>
					<Input name='color' register={register} label='Color' placeholder='ex. Teal Green' className='bg-gray-50 rounded-lg border-gray-300 w-full p-3 h-[6.5vh]' errors={errors} />
				</div>

				<div className='w-full space-y-2'>
					<div className='flex items-center justify-between gap-4 w-full'>
						<Input register={register} name='comparePrice' placeholder={`ex. ${isRupee ? 'INR 4000' : 'AED 299'}`} label='Compare Price' className=' bg-gray-50 border-gray-300 rounded-lg w-full' errors={errors} />
						<Input register={register} name='price' placeholder={`ex. ${isRupee ? 'INR 3000' : 'AED 199'}`} label='Price' className=' bg-gray-50 border-gray-300 rounded-lg w-full' errors={errors} />
					</div>
					<div className='flex items-center justify-start gap-2'>
						<input type="checkbox" checked={isRupee} className='border-none size-5' id='rupee' onClick={() => setIsRupee((prev) => !prev)} />
						<label htmlFor="rupee" className='text-sm text-gray-600 font-medium'>All values in Indian Rupees</label>
					</div>
				</div>

				<div className='flex flex-col items-start justify-start gap-2 self-start'>
					<label htmlFor="images" className='text-sm font-medium text-stone-800'>Select Images:</label>
					<input type="file" accept='image/*' {...register("images")} id="images" multiple />
					{
						errors &&
						errors[`images`] &&
						<span className='text-xs bg-[#ff4e4e] dark:bg-[#8d1a1a] text-white py-1 px-2 rounded-md mt-4'>{errors[`images`] && errors[`images`].message}</span>
					}
				</div>

				<div className='flex items-center justify-start gap-2 self-start'>
					<input type="checkbox" checked={onTop} className='border-none size-5' id='top' onClick={() => setOnTop((prev) => !prev)} />
					<label htmlFor="top" className='text-sm text-gray-600 font-medium'>Suggest This Product On Top</label>
				</div>

				<div className='space-x-4'>
					<Button type='submit' disabled={loader}>
						{
							loader ?
								<LightSpinner color={'fill-gray-400'} /> :
								'Submit'
						}
					</Button>

					<Button type='button' onClick={() => reset()}>
						Reset
					</Button>
				</div>

			</form>
		</Container>
	)
}

export default AddProduct