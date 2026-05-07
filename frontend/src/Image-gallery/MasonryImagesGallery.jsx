import React from 'react'
import galleryImages from './galleryImages'
<<<<<<< HEAD
import Masonry from 'react-responsive-masonry'
=======
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
>>>>>>> 657fce8 (login properly)

const MasonryImagesGallery = () => {
  return (
    <div className="px-2 sm:px-4">
<<<<<<< HEAD
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
=======
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
>>>>>>> 657fce8 (login properly)
    </div>
  )
}

export default MasonryImagesGallery