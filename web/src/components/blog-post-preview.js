import { Link } from 'gatsby'
import React from 'react'

import BlockText from './block-text'

import { buildImageObj, cn, getBlogUrl } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

function BlogPostPreview(props) {
  return (
    <Link
      className="inline-block w-full bg-white border border-solid border-gray-300 rounded-md overflow-hidden text-left"
      to={getBlogUrl(props.publishedAt, props.slug.current)}
    >
      <div>
        {props.mainImage && props.mainImage.asset && (
          <img
            src={imageUrlFor(buildImageObj(props.mainImage))
              .width(600)
              .height(Math.floor((9 / 16) * 600))
              .url()}
            alt={props.mainImage.alt}
          />
        )}
      </div>
      <div className="inline-block relative w-full p-4">
        <strong
          className={`inline-block realtive w-full font-semibold text-black text-lg ${
            props._rawExcerpt ? 'mb-4' : 'mb-0'
          }`}
        >
          {props.title}
        </strong>
        {props._rawExcerpt && (
          <div className="inline-block relative w-full text-gray-600 text-sm">
            <BlockText blocks={props._rawExcerpt} />
          </div>
        )}
      </div>
    </Link>
  )
}

export default BlogPostPreview
