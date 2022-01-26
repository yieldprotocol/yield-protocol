import React from 'react'
import { graphql } from 'gatsby'
import { format, distanceInWords, differenceInDays } from 'date-fns'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import Container from '../components/container'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-800 mb-4'

export const query = graphql`
  query CareerTemplateQuery($title: String!) {
    career: sanityCareer(title: { eq: $title }) {
      id
      publishedAt
      title
      excerpt
      _rawBody
      slug {
        current
      }
      apply
    }
  }
`

const CareerTemplate = props => {
  const { data, errors } = props
  const career = data && data.career

  return (
    <Layout>
      {errors && <SEO title="GraphQL Error" />}
      {career && <SEO title={career.title || 'Untitled'} />}

      {errors && (
        <Container>
          <GraphQLErrorList errors={errors} />
        </Container>
      )}

      <Container className="max-w-xl my-24">
        {career ? (
          <div className="inline-block relative w-full text-white">
            {career.title ? (
              <h2 className="font-bold text-xl md:text-3xl text-gray-900">{career.title}</h2>
            ) : null}
            {career.publishedAt ? (
              <small className="inline-block relative w-full text-gray-500 text-sm my-4 md:my-6">
                Posted on:{' '}
                {differenceInDays(new Date(career.publishedAt), new Date()) > 3
                  ? distanceInWords(new Date(career.publishedAt), new Date())
                  : format(new Date(career.publishedAt), 'MMMM Do YYYY')}
              </small>
            ) : null}
            {career._rawBody ? (
              <div className={`${ParagraphClass} mb-8 list`}>
                <BlockContent blocks={career._rawBody || []} />
              </div>
            ) : null}
            <a
              className="block text-center border-2 border-solid border-black bg-black text-white font-bold px-4 py-2 w-full"
              target="_blank"
              href={
                career.apply
                  ? career.apply
                  : `mailto:contact@yield.is?subject=${career && career.title ? career.title : ''}`
              }
              rel="noopener noreferrer"
            >
              Apply
            </a>
          </div>
        ) : (
          <div>
            <p className={ParagraphClass}>Woops, couldn't load this link, please try again!</p>
          </div>
        )}
      </Container>
    </Layout>
  )
}

export default CareerTemplate
