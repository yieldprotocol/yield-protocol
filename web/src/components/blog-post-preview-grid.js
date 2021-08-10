import { Link } from 'gatsby'
import React from 'react'

import BlogPostPreview from './blog-post-preview'

function BlogPostPreviewGrid(props) {
  return (
    <div className="inline-block w-full">
      {props.title && (
        <div className="flex justify-between items-center my-8">
          <h3 className="inline-block relative w-auto text-xl md:text-3xl mb-0">
            {props.title || `Blog posts`}
          </h3>
          {props.browseMoreHref ? (
            <Link className="text-right underline text-sm" to={props.browseMoreHref}>
              View more
            </Link>
          ) : null}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {props.nodes && props.nodes.map(node => <BlogPostPreview {...node} key={node.id} />)}
      </div>
    </div>
  )
}

BlogPostPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default BlogPostPreviewGrid
