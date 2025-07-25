import React from 'react'
import galleryImages from './galleryImages'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

const MasonryImagesGallery = () => {
  return (
    <div className="px-2 sm:px-4">
      <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 480: 2, 768: 3, 1024: 4 }}>
        <Masonry gutter="1rem">
          {galleryImages.map((item, index) => (
            <img
              className="masonry__img transition-transform duration-300 hover:scale-105"
              src={item}
              key={index}
              alt=""
              style={{
                width: "100%",
                display: "block",
                borderRadius: "10px",
                marginBottom: "0.5rem"
              }}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export default MasonryImagesGallery