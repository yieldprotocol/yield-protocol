import React from 'react'
import { graphql } from 'gatsby'

// Libs
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

// Components
import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import SEO from '../components/seo'

// Layout
import Layout from '../containers/layout'

export const query = graphql`
  query PrivacyPageQuery {
    companyInfo: sanityCompanyInfo(_id: { regex: "/(drafts.|)companyInfo/" }) {
      country
      socials {
        title
        image {
          asset {
            _id
          }
        }
        url
      }
      email
      city
      name
    }

    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      image {
        asset {
          _id
        }
      }
      keywords
    }

    page: allSanityPage(filter: { title: { regex: "/Privacy/" } }) {
      edges {
        node {
          title
          _rawBody
        }
      }
    }
  }
`

const PrivacyPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site
  const page = (data || {}).page
  let privacy

  if (page) {
    privacy = page.edges[0].node
  }

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  if (!page) {
    throw new Error(
      'Missing "Pages > Home". Open the studio at http://localhost:3333 and add some content to "Pages > Terms" and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO
        title={privacy.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />
      <article className="block mx-auto px-5 py-24 md:py-32 max-w-5xl">
        <h1 className="text-3xl font-bold">{privacy.title}</h1>
        <div className="block-text">
          {privacy._rawBody && <BlockContent blocks={privacy._rawBody} />}
        </div>
      </article>
    </Layout>
  )
}

export default PrivacyPage
