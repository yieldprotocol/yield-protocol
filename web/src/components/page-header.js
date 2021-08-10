import React from 'react'

import BlockContent from '../components/block-content'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600'

const PageHeader = props => {
  const { title, image, body } = props
  return (
    <div className="inline-block relative w-full">
      <h1 className={`inline-block relative w-full text-3xl font-bold md:text-5xl ${image ? 'mb-0' : 'mb-8'}`}>{title}</h1>
      {image ? (
        <img
          className="inline-block w-full fit rounded-sm my-8"
          src={imageUrlFor(buildImageObj(image)).url()}
        />
      ) : null}
      {body ? (
        <div className="inline-block relative w-full max-w-2xl">
          <div className={ParagraphClass}>
            <BlockContent blocks={body || []} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PageHeader
