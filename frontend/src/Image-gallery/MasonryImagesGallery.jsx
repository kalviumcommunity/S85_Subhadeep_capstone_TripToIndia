import React from 'react'
import galleryImages from './galleryImages'
import Masonry from 'react-responsive-masonry'

const MasonryImagesGallery = () => {
  return (
    <div className="px-4">
      <Masonry columnsCount={4} gutter="1rem">
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
    </div>
  )
}

export default MasonryImagesGallery