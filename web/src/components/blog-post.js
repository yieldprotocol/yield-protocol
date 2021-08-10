import { format, distanceInWords, differenceInDays } from 'date-fns'
import React from 'react'
import { Link } from 'gatsby'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import BlockContent from './block-content'
import Categories from "./categories"
import Container from './container'
import RoleList from './role-list'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600 mb-8'
const SubheadingClass = 'inline-block relative w-full text-sm text-gray-400 font-medium mb-4'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl'

function BlogPost(props) {
  const { _rawBody, authors, categories, title, mainImage, publishedAt } = props
  return (
    <article>
      <Container>
        {mainImage && mainImage.asset && (
          <div className="inline-block relative w-full mt-16 md:mt-32 mb-8 text-left md:text-center">
            <img
              className="inline-block relative w-full fit"
              src={imageUrlFor(buildImageObj(mainImage)).url()}
              alt={mainImage.alt}
            />
          </div>
        )}
        <div
          className={`inline-block relative w-full leading-loose ${
            mainImage && mainImage.asset ? 'py-0' : 'py-16 md:py-32'
          }`}
        >
          <div className="inline-block relative w-full">
            <h1 className={HeadingClass}>{title}</h1>
            {publishedAt && (
              <small className="inline-block relative w-full text-gray-400 text-sm mb-8">
                Posted on:{' '}
                {differenceInDays(new Date(publishedAt), new Date()) > 3
                  ? distanceInWords(new Date(publishedAt), new Date())
                  : format(new Date(publishedAt), 'MMMM Do YYYY')}
              </small>
            )}
            <div className={ParagraphClass}>{_rawBody && <BlockContent blocks={_rawBody} />}</div>
          </div>
          <aside>
            {authors && authors.length > 0 && (
              <div className="inline-block relative w-full mb-8">
                <h2 className={SubheadingClass}>Authors</h2>
                <RoleList items={authors} />
              </div>
            )}
            {categories && categories.length > 0 && <Categories categories={categories} />}
          </aside>
        </div>
      </Container>
    </article>
  )
}

export default BlogPost
