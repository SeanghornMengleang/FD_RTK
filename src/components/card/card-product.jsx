import React from "react";
import { Link } from "react-router-dom";
import { getFirstValidImage, hasValidImages, cleanImageUrl } from "../../utils/imageUtils";

export default function CardProduct({ thumbnail, title, id }) {
  
  // Debug logging
  console.log('CardProduct - thumbnail:', thumbnail);
  console.log('CardProduct - title:', title);
  console.log('CardProduct - id:', id);
  
  // Clean and validate the thumbnail
  const cleanedThumbnail = cleanImageUrl(thumbnail);
  const hasValidImage = thumbnail && thumbnail.trim() !== '' && thumbnail !== 'https://via.placeholder.com/400x280?text=No+Image';
  
  return (
    <>
      {/*<!-- Component: Basic image card --> */}
      <Link
        to={`/products/${id}`}
        className="overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200"
      >
        {/*  <!--  Image --> */}
        <figure className="relative">
          <img
            src={cleanedThumbnail}
            alt="card image"
            className="aspect-video w-full object-cover h-[280px]"
            onError={(e) => {
              // console.error('Card image failed to load:', e.target.src);
              e.target.src = 'https://via.placeholder.com/400x280?text=Image+Not+Available';
            }}
          />
          {!hasValidImage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              No Image
            </div>
          )}
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="">
            <h3 className="text-xl font-medium text-slate-700">{title}</h3>
          </header>
        </div>
      </Link>
      {/*<!-- End Basic image card --> */}
    </>
  );
}