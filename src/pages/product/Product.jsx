import React from "react";
import { Link } from "react-router-dom";
import CardProduct from "../../components/card/card-product";
import { useGetProductsQuery } from "../../features/product/productSlice2";
import { hasValidImages, getFirstValidImage } from "../../utils/imageUtils";

export default function Product() {
  // Get products data with refetch capability
  const { data, isLoading, isError, refetch } = useGetProductsQuery();
  
  // Debug logging in development
  if (import.meta.env.DEV) {
    console.log("Products data:", data);
    console.log("Products count:", data?.length);
    if (data && data.length > 0) {
      console.log("First product structure:", data[0]);
      console.log("First product images:", data[0].images);
      
      // Check for products without valid images
      const productsWithoutValidImages = data.filter(product => !hasValidImages(product));
      
      if (productsWithoutValidImages.length > 0) {
        console.warn("Products without valid images:", productsWithoutValidImages);
        console.warn("Total products without valid images:", productsWithoutValidImages.length);
      }
      
      // Log all products with their image status
      data.forEach((product, index) => {
        const hasValidImage = hasValidImages(product);
        console.log(`Product ${index + 1} (ID: ${product.id}): ${hasValidImage ? 'Has valid images' : 'No valid images'}`, {
          title: product.title,
          images: product.images,
          hasValidImages: hasValidImage
        });
      });
    }
  }
  
  return (
    <main className="max-w-screen-xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Total: {data?.length || 0} products</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <Link
            to="/products/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Product
          </Link>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading products</p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Products Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {data?.map((product) => (
          <CardProduct 
            key={product.id} 
            id={product.id}
            thumbnail={getFirstValidImage(product.images)} 
            title={product.title} 
          />
        ))}
      </section>
      
      {/* Empty State */}
      {data?.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </main>
  );
}
