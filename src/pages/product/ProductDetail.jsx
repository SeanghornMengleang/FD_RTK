import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { getFirstValidImage, hasValidImages } from "../../utils/imageUtils";
import { useGetProductByIdQuery } from "../../features/product/productSlice2";


const dataDetail = () => {
  const { id } = useParams();
  const { data: data, isLoading } = useGetProductByIdQuery(id);
  const [quantity, setQuantity] = useState(2);
  const [activeImage, setActiveImage] = useState(0);

  // Debug logging
  console.log("data Detail - data data:", data);
  console.log("data Detail - Images:", data?.images);
  console.log("data Detail - Active image index:", activeImage);
  console.log("data Detail - Has valid images:", hasValidImages(data));

  // Star rating render function (4.5 stars example)
  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 inline" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
      }
    }
    return stars;
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans flex flex-col md:flex-row gap-8">
      {/* Image Section */}
      <div className="md:w-1/2">
        <div className="bg-gray-50 p-8 rounded-lg">
          <img
            src={
              getFirstValidImage(data?.images) ||
              "https://via.placeholder.com/600x600"
            }
            alt={data?.title || "data image"}
            className="w-full h-auto object-contain max-h-[500px] mix-blend-multiply"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              e.target.src =
                "https://via.placeholder.com/600x600?text=Image+Not+Available";
            }}
          />
          {!hasValidImages(data) && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <ul className="list-disc list-inside mt-2 ml-4">
                  <li>Malformed image URLs in the database</li>
                  <li>Images that were not properly uploaded</li>
                  <li>API issues during data creation</li>
                </ul>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data?.name}</h1>

        {/* Changed from checkmarks to stars */}
        <div className="flex items-center mb-3">
          <div className="mr-2 text-lg">{renderStars()}</div>
          <span className="text-gray-600 text-sm">22 reviews</span>
        </div>

        <p className="text-gray-700 mb-5 leading-relaxed">
          {data?.description}
        </p>

        <div className="text-3xl font-bold text-gray-900 mb-5">
          $ {data?.priceOut}
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-sm mb-2">Select quantity</h3>
          <div className="flex items-center border border-gray-300 rounded w-24">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 w-8"
            >
              -
            </button>
            <div className="flex-1 text-center py-1 text-sm">{quantity}</div>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 w-8"
            >
              +
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-none text-sm tracking-wide">
          Add to Cart
        </button>
      </div>

      <div className=" w-full sm:w-96 md:w-8/12  lg:w-5/12 flex lg:flex-row flex-col flex-grow-1 lg:gap-4 sm:gap-6 gap-4">
        <div className="p-2 w-full rounded-2xl lg:w-full bg-gray-100 flex justify-center items-center">
          <img
            className="w-full h-full object-cover rounded-xl "
            src={data?.thumbnail}
            alt="Wooden Chair Preview"
          />
        </div>
        <div className="w-full lg:w-5/12 grid lg:grid-cols-1 sm:grid-cols-4 grid-cols-2 gap-4">
          {data?.images?.map((image, index) => (
            <div
              key={index}
              className="p-2 bg-slate-100 rounded-2xl flex justify-center items-center"
            >
              <img
                className="w-full h-full object-cover rounded-xl"
                src={image}
                alt="Wooden chair - preview 1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default dataDetail;
