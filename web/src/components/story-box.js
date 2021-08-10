import React from 'react'
import { Link } from 'gatsby'
import EllipsisText from 'react-ellipsis-text'

import { buildImageObj, getStoryUrl } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const StoryBox = props => {
  const { className, story } = props
  return (
    <div className={`inline-block bg-white w-full mb-2 ${className ? className : ''}`}>
      {story.mainImage ? (
        <img
          className="inline-block w-full h-56 fit"
          src={imageUrlFor(buildImageObj(story.mainImage)).url()}
        />
      ) : null}
      {story.title || story.excerpt ? (
        <div className="inline-block relative w-full p-8 text-gray-600">
          {story.title ? (
            <strong className="inline-block text-black w-full mb-2">{story.title}</strong>
          ) : null}
          {story.excerpt ? (
            <p className="inline-block text-sm w-full mb-4">
              <EllipsisText text={story.excerpt} length={48} />
            </p>
          ) : null}
          {story.slug && story.slug.current ? (
            <Link
              className="inline-block relative w-full text-black text-center py-1 ph-3 text-sm font-semibold border border-solid border-gray-400 rounded"
              to={getStoryUrl(story.slug.current)}
            >
              Read more
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default StoryBox
