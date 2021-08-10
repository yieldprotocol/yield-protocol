import React from 'react'

import BlockText from './block-text'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const ParagraphClass = 'inline-block relative w-full text-sm text-gray-600 my-4'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl my-8'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
}

function ProfileCard({ image, title, name, _rawBio }) {
  return (
    <div className="inline-block relative rounded-sm overflow-hidden bg-black text-left">
      <div>
        {image && image.asset && (
          <img
            className="inline-block relative w-full mb-4"
            src={imageUrlFor(buildImageObj(image))
              .width(600)
              .height(600)
              .fit('crop')
              .url()}
          />
        )}
      </div>
      <strong className="inline-block relateive w-full text-lg text-white font-medium">
        {name}
      </strong>
      {title && <p className="inline-block relative w-full text-sm text-gray-500">{title}</p>}
      {_rawBio && (
        <div className={ParagraphClass}>
          <BlockText blocks={_rawBio} />
        </div>
      )}
    </div>
  )
}

function PeopleGrid({ items, title }) {
  return (
    <div>
      {<h3 className={HeadingClass}>{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <ProfileCard {...item} key={item.id} />
        ))}
      </div>
    </div>
  )
}

export default PeopleGrid
