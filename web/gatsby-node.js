const { format } = require('date-fns')

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

async function createCategoryPages(graphql, actions, reporter) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allSanityCategory(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            title
            slug {
              current
            }
          }
        }
      }
    }
  `)

  if (result.errors) throw result.errors

  const categoryEdges = (result.data.allSanityCategory || {}).edges || []

  categoryEdges.forEach(edge => {
    const title = edge.node.title
    const slug = edge.node.slug.current
    const path = `/categories/${slug}/`

    reporter.info(`Creating category page: ${path}`)

    createPage({
      path,
      component: require.resolve('./src/templates/category.js'),
      context: { title, slug }
    })
  })
}

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

async function createBlogPages(graphql, actions, reporter) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allSanityPost(filter: { slug: { current: { ne: null } } }) {
        edges {
          node {
            id
            title
            _rawExcerpt
            publishedAt
            slug {
              current
            }
          }
        }
      }
    }
  `)

  if (result.errors) throw result.errors

  const postEdges = (result.data.allSanityPost || {}).edges || []

  postEdges.forEach(edge => {
    const { id, title, slug = {}, publishedAt } = edge.node
    const dateSegment = format(publishedAt, 'YYYY/MM')
    const path = `/blog/${dateSegment}/${slug.current}/`

    reporter.info(`Creating blog page: ${path}`)

    createPage({
      path,
      component: require.resolve('./src/templates/post.js'),
      context: { id, title }
    })
  })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  // await createCategoryPages(graphql, actions, reporter)
  await createCareerPages(graphql, actions, reporter)
  // await createBlogPages(graphql, actions, reporter)
}
