// ProductForm.js (new file)
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateProductMutation } from "../features/product/productSlice2";
import { toast } from "react-toastify";

export default function ProductForm() {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState([]);

  const onSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        price: Number(data.price),
        categoryId: 1, // Default category, you can make this dynamic
        images: images.map(img => img.url) // Assuming images is an array of {url: string}
      };
      
      await createProduct(productData).unwrap();
      toast.success("Product created successfully!");
      reset();
      setImages([]);
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleImageUpload = (e) => {
    // In a real app, you would upload the images to a server first
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setImages([...images, ...newImages]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register("title", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description", { required: true })}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, index) => (
              <img key={index} src={img.url} alt="" className="h-20 w-20 object-cover rounded" />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-teal-300"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}