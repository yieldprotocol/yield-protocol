const { format } = require('date-fns')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

async function createCareerPages(graphql, actions, reporter) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allSanityCareer(filter: { slug: { current: { ne: null } } }) {
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
  `)

  if (result.errors) throw result.errors

  const careerEdges = (result.data.allSanityCareer || {}).edges || []

  careerEdges.forEach(edge => {
    const title = edge.node.title
    const slug = edge.node.slug.current
    const path = `/careers/${slug}/`

    reporter.info(`Creating career page: ${path}`)

    createPage({
      path,
      component: require.resolve('./src/templates/career.js'),
      context: { title, slug }
    })
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  await createCareerPages(graphql, actions, reporter)
}
