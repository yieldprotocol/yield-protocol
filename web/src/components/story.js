import { format, distanceInWords, differenceInDays } from 'date-fns'
import React from 'react'
import { Link } from 'gatsby'

import BlockContent from './block-content'
import Categories from './categories'
import Container from './container'
import RoleList from './role-list'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600 mb-8'
const SubheadingClass = 'inline-block relative w-full text-sm text-gray-400 font-medium mb-4'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl'

function Story(props) {
  const {
    _rawBody,
    title,
    categories,
    mainImage,
    logo,
    members,
    publishedAt,
    relatedStories
  } = props
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
            <div className="inline-block md:flex align-middle justify-between">
              <div className="inline-block relative w-full md:w-auto max-w-full">
                <h1 className={HeadingClass}>{title}</h1>
                {publishedAt && (
                  <small className="inline-block relative w-full text-gray-400 text-sm mb-8">
                    Posted on:{' '}
                    {differenceInDays(new Date(publishedAt), new Date()) > 3
                      ? distanceInWords(new Date(publishedAt), new Date())
                      : format(new Date(publishedAt), 'MMMM Do YYYY')}
                  </small>
                )}
              </div>
              {logo && logo.asset && logo.asset._id ? (
                <div className="flex justify-start items-center relative w-full md:w-auto mb-8">
                  <span className="inline-block relative mr-4">
                    <img
                      className="inline-block relative w-auto h-6 fit"
                      src={imageUrlFor(buildImageObj(logo)).url()}
                    />
                  </span>
                  <small className="inline-block text-sm font-medium">{logo.alt}</small>
                </div>
              ) : null}
            </div>
            <div className={ParagraphClass}>{_rawBody && <BlockContent blocks={_rawBody} />}</div>
          </div>
          <aside>
            {members && members.length > 0 && (
              <div className="inline-block relative w-full mb-8">
                <h2 className={SubheadingClass}>Authors</h2>
                <RoleList items={members} />
              </div>
            )}
            {categories && categories.length > 0 && <Categories categories={categories} />}
            {relatedStories && relatedStories.length > 0 && (
              <div className="inline-block relative w-full">
                <h4 className={SubheadingClass}>Related stories</h4>
                <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedStories.map(story => (
                    <li key={`related_${story._id}`}>
                      <Link
                        className="inline-block relative w-full leading-relaxed"
                        to={`/story/${story.slug.current}`}
                      >
                        {story.mainImage && story.mainImage.asset && story.mainImage.asset._id ? (
                          <img
                            className="inline-block relative w-full mb-4 h-48 fit"
                            src={imageUrlFor(buildImageObj(story.mainImage)).url()}
                          />
                        ) : null}
                        <div className="inline-block relative w-full">
                          <strong className="inline-block relative w-full mb-4 font-medium">
                            {story.title}
                          </strong>
                          <p className="inline-block relative w-full text-xs text-gray-600">
                            {story.excerpt}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </article>
  )
}

export default Story
