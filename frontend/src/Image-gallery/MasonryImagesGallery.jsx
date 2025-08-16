import React from 'react'
import galleryImages from './galleryImages'
import Masonry from 'react-responsive-masonry'

const MasonryImagesGallery = () => {
  return (
    <div className="px-2 sm:px-4">
      <Masonry
        columnsCount={4}
        gutter="1rem"
        columnsCountBreakPoints={{
          350: 1,    // 1 column on small mobile
          640: 2,    // 2 columns on mobile
          768: 3,    // 3 columns on tablet
          1024: 4    // 4 columns on desktop (unchanged)
        }}
      >
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