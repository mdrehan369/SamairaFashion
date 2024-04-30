import React, { useState } from 'react';
import { Container, Input, Button, TextArea, Spinner } from "../../components/index.js";
import { useForm } from "react-hook-form";
import noProduct from "../../assets/noProduct.jpeg"
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function AddProduct() {

	const { register, handleSubmit } = useForm();
	const [image, setImage] = useState("");
	const [imagePath, setImagePath] = useState('');
	const [loader, setLoader] = useState(false);
	const navigate = useNavigate();

	const submit = async (data) => {
		setLoader(true);
		try {
			const formData = new FormData(document.getElementsByTagName("form")[0]);
			formData.delete("image");
			formData.append("image", imagePath);

			await axios.post("/api/v1/products/product", formData);
			navigate("/admin/products")
		} catch (e) {
			console.log(e);
		} finally {
			setLoader(false);
		}
	}

	return (
		!loader ?
		<Container className='flex items-center justify-center h-full'>
			<form onSubmit={handleSubmit(submit)} className='flex items-center justify-center gap-4 border-2 h-[90%] w-[90%] rounded-xl bg-slate-200'>
				<div className='space-y-4'>
					<img src={image || noProduct} className='rounded-xl h-[65vh] object-cover' />
					<input type="file" id='image' hidden name="image" {...register("image")} onChange={(e) => {setImage(URL.createObjectURL(e.target.files[0]));
					setImagePath(e.target.files[0]);
					}} />
					<Button className='w-[40%]' type='button'>
						<label htmlFor="image">Add Image</label>
					</Button>
				</div>
				<div>
					<Input name='title' register={register} placeholder='Title' required />
					<TextArea name='description' register={register} placeholder='Description' required />
					<select name="category" {...register("category")} className='w-[90%] shadow-md bg-gray-100 p-3 m-4 rounded-lg'>
						<option value="Umbrella">Umbrella</option>
						<option value="Straight">Straight</option>
						<option value="Farasha">Farasha</option>
						<option value="Tye Dye">Tye Dye</option>
					</select>
					<Input type='number' name='price' register={register} placeholder='Price' required />
					<Input type='number' name='comparePrice' register={register} placeholder='Compare price' required />
					<Button type='submit'>
						Save
					</Button>
				</div>
			</form>
		</Container>
		: <Spinner />
	)
}

export default AddProduct