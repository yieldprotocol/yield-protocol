import { Link } from 'gatsby'
import React from 'react'
import StoryPreview from './story-preview'

function StoryPreviewGrid(props) {
  return (
    <div>
      {props.title && (
        <h2>
          {props.browseMoreHref ? (
            <Link to={props.browseMoreHref}>{props.title}</Link>
          ) : (
            props.title
          )}
        </h2>
      )}
      <ul>
        {props.nodes &&
          props.nodes.map(node => (
            <li key={node.id}>
              <StoryPreview {...node} />
            </li>
          ))}
      </ul>
      {props.browseMoreHref && (
        <div>
          <Link to={props.browseMoreHref}>Browse more</Link>
        </div>
      )}
    </div>
  )
}

StoryPreviewGrid.defaultProps = {
  title: '',
  nodes: [],
  browseMoreHref: ''
}

export default StoryPreviewGrid
