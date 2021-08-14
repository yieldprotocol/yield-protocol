import React from 'react'
import { Link } from 'gatsby'

import Logo from './logo'

import { logEvent } from '../utils/analytics'
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const classLinks =
  'flex justify-start items-center w-auto font-normal inherit mb-2 md:mb-0 mr-0 md:mr-8 link py-1'

const Footer = class extends React.Component {
  constructor(props) {
    super(props)

    this.logClick = this.logClick.bind(this)
  }

  logClick(name) {
    const event = {
      category: 'Social',
      action: `Clicked ${name}`,
    }
    logEvent(event)
  }

  render() {
    const { socials } = this.props

    const footerLinks = [
      {
        title: 'Follow us',
        list: socials.map((social) => {
          return {
            external: true,
            title: social.title,
            image: social.image,
            link: social.url,
          }
        }),
      },
      {
        title: 'Resources',
        list: [
          {
            external: true,
            title: 'Blog',
            link: 'https://medium.com/yield-protocol',
          },
          {
            external: true,
            title: 'White paper',
            link: '/Yield.pdf',
          },
          {
            external: true,
            title: 'YieldSpace Paper',
            link: '/YieldSpace.pdf',
          },
        ],
      },
    ]

    const LinkComponent = ({ title, list }) =>
      list.map((item, index) =>
        item.external ? (
          <a className={classLinks} target="_blank" href={item.link} key={`link-external-${index}`}>
            {item.image ? (
              <img
                className="inline-block align-middle mr-2 h-4 w-4 contain"
                src={imageUrlFor(buildImageObj(item.image))}
              />
            ) : null}{' '}
            {item.title} {item.cta}
          </a>
        ) : (
          <Link className={classLinks} to={item.link} key={`link-internal-${index}`}>
            {item.title}
          </Link>
        )
      )

    return (
      <footer className="inline-block w-full py-6 px-5 md:px-12 relative xl:fixed bottom-0 right-0 left-0 text-xs z-20 footer text-gray-600">
        <div className="flex flex-col md:flex-row">
          {footerLinks.map((object, index) => (
            <LinkComponent title={object.title} list={object.list} key={index} />
          ))}
        </div>
      </footer>
    )
  }
}

export default Footer
