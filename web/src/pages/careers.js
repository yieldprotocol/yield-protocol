import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from '../components/page-header'

import Container from '../components/container'
import Careers from '../components/careers'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from '../lib/helpers'

export const query = graphql`
  query CareersPageQuery {
    page: sanityCareers(_id: { regex: "/(drafts.|)careers/" }) {
      id
      title
    }
    careers: allSanityCareer(sort: { fields: [publishedAt], order: ASC }) {
      edges {
        node {
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
    }
  }
`

const CareersPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data && data.page
  const careerNodes =
    data && data.careers && mapEdgesToNodes(data.careers).filter(filterOutDocsWithoutSlugs)

  if (!page) {
    throw new Error(
      'Missing "Careers" page data. Open the studio at http://localhost:3333 and add "Careers" page data and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={page.title} />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
          <div className="inline-block relative w-full">
            <PageHeader
              title={page.title || `Careers`}
              image={typeof page.image !== undefined ? page.image : undefined}
              body={typeof page._rawBody !== undefined ? page._rawBody : undefined}
            />
            <div className="inline-block relative w-full max-w-2xl">
              <Careers nodes={careerNodes} />
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default CareersPage
