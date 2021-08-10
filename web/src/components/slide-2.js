import React from 'react'

import Button from './button'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const Slide2 = props => {
  const { background, title, description, button, image, split } = props
  return (
    <div className={`w-full ${split ? '' : 'mb-8'}`}>
      <div className={`inline-block p-4 md:p-8 rounded ${background ? background : 'bg-gray-900'}`}>
        <h2 className="inline-block relative w-full text-xl md:text-3xl">{title}</h2>
        {image ? (
          <img
            className="inline-block w-full h-64 fit rounded-sm my-8"
            src={imageUrlFor(buildImageObj(image)).url()}
          />
        ) : null}
        {description ? (
          <p className="inline-block w-full text-sm text-gray-400 mb-8">{description}</p>
        ) : null}
        {button ? <Button to="/contact" full /> : null}
      </div>
    </div>
  )
}

export default Slide2
