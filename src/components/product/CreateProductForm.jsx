import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation, useGetCategoriesQuery } from "../../features/product/productSlice2";
import { toast } from "react-toastify";

export default function CreateProductForm() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [images, setImages] = useState([]);
  const [customImageUrls, setCustomImageUrls] = useState([]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => img.file && URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const testApiConnection = async () => {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      const data = await response.json();
      console.log("API test successful:", data);
      toast.success("API connection working!");
    } catch (error) {
      console.error("API test failed:", error);
      toast.error("API connection failed: " + error.message);
    }
  };

  const generateSlug = (title) => {
    return (
      title?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now()
    );
  };

  const onSubmit = async (data) => {
    try {
      const sampleImages = [
        "https://picsum.photos/640/640?r=1",
        "https://picsum.photos/640/640?r=2",
        "https://picsum.photos/640/640?r=3",
      ];

      const finalImages = [
        ...customImageUrls,
        ...sampleImages.slice(0, Math.max(0, 3 - customImageUrls.length)),
      ];

      const productData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        images: finalImages.slice(0, 3),
        slug: generateSlug(data.title),
      };

      console.log("Submitting product data:", productData);
      const result = await createProduct(productData).unwrap();
      toast.success("Product created successfully!");
      console.log("Created product:", result);

      reset();
      setImages([]);
      setCustomImageUrls([]);

      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage =
        error.data?.message || error.error || error.message || "Unknown error occurred";
      toast.error("Failed to create product: " + errorMessage);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (index < customImageUrls.length) {
      setCustomImageUrls(customImageUrls.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create New Product
      </h2>

      <button
        type="button"
        onClick={testApiConnection}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors mb-4"
      >
        Test API Connection
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title *
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "At least 10 characters" },
            })}
            rows="3"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register("categoryId", { required: "Category is required" })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            disabled={categoriesLoading}
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select a category"}
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="Or paste image URL and press Enter"
            className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = e.target.value.trim();
                if (url) {
                  setCustomImageUrls((prev) => [...prev, url]);
                  setImages((prev) => [...prev, { url, name: "Custom URL" }]);
                  e.target.value = "";
                }
              }
            }}
          />

          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
