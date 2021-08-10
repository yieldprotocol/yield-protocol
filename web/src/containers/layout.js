import { graphql, StaticQuery } from 'gatsby'
import React from 'react'

import Layout from '../components/layout'

const query = graphql`
  query SiteTitleQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
    }
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
  }
`

function LayoutContainer(props) {
  return (
    <StaticQuery
      query={query}
      render={data => {
        if (!data || !data.site) {
          throw new Error(
            'Missing "Site settings". Open the studio at http://localhost:3333 and add "Site settings" data'
          )
        }
        if (!data || !data.companyInfo) {
          throw new Error(
            'Missing "Company info". Open the studio at http://localhost:3333 and add "Company info" data'
          )
        }
        return <Layout {...props} companyInfo={data.companyInfo} siteTitle={data.site.title || `Yield`} />
      }}
    />
  )
}

export default LayoutContainer
