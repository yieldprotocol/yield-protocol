import React from 'react'
import EllipsisText from 'react-ellipsis-text'
import { Link } from 'gatsby'

import { buildImageObj, getBlogUrl } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const Slide = ({ index, slide }) => {
  return (
    <div className="inline-block bg-white w-full">
      {slide.mainImage ? (
        <img
          className="inline-block w-full h-56 fit"
          src={imageUrlFor(buildImageObj(slide.mainImage)).url()}
        />
      ) : null}
      {slide.title || slide.excerpt ? (
        <div className="inline-block relative w-full p-8 text-gray-600">
          {slide.title ? (
            <strong className="inline-block text-black w-full mb-2">{slide.title}</strong>
          ) : null}
          {slide.excerpt ? (
            <p className="inline-block text-sm w-full mb-4">
              <EllipsisText text={slide.excerpt} length={48} />
            </p>
          ) : null}
          {slide.slug && slide.slug.current ? (
            <Link
              className="inline-block relative w-full text-black text-center py-1 ph-3 text-sm font-semibold border border-solid border-gray-400"
              to={getBlogUrl(slide.publishedAt, slide.slug.current)}
            >
              Read more
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default Slide
