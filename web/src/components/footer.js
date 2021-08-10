import React from 'react'
import { Link } from 'gatsby'

import Logotype from './logotype'

import { logEvent } from '../utils/analytics'
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const classLinks =
  'inline-block align-middle w-full md:w-auto font-normal inherit text-base mb-2 md:mb-0 mr-0 md:mr-8 link py-1'

const Footer = class extends React.Component {
  constructor(props) {
    super(props)

    this.logClick = this.logClick.bind(this)
  }

  logClick(name) {
    const event = {
      category: 'Social',
      action: `Clicked ${name}`
    }
    logEvent(event)
  }

  render() {
    const { country, socials, company, email, city, dark } = this.props

    const footerLinks = [
      {
        title: 'Follow us',
        list: socials.map(social => {
          return {
            external: true,
            title: social.title,
            image: social.image,
            link: social.url
          }
        })
      },
      {
        title: 'Resources',
        list: [
          {
            external: true,
            title: 'Blog',
            link: 'https://medium.com/yield-protocol'
          },
          {
            external: true,
            title: 'White paper',
            link: '/Yield.pdf'
          },
          {
            external: true,
            title: 'YieldSpace Paper',
            link: '/YieldSpace.pdf'
          },
          {
            title: 'Careers',
            link: '/careers',
          }
        ]
      }
    ]

    const getAsset = title => {
      switch (title) {
        case 'twitter':
          return '/social/twitter.svg'
          break
        case 'discord':
          return '/social/discord.svg'
          break
        case 'github':
          return '/social/github.svg'
          break
        case 'docs':
          return '/social/book.svg'
          break
        case 'defi pulse':
          return '/social/defipulse.svg'
        default:
          break
      }
    }

    const LinkComponent = ({ title, list }) =>
      list.map((item, index) =>
        item.external ? (
          <a className={classLinks} target="_blank" href={item.link} key={`link-external-${index}`}>
            {item.image ? (
              <img
                className="inline-block align-middle mr-2 h-4 w-4 contain"
                // src={imageUrlFor(buildImageObj(item.image))}
                src={getAsset(item.title.toLowerCase())}
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
      <footer
        className={`inline-block w-full py-6 px-5 md:px-12 realtive xl:fixed bottom-0 right-0 left-0 text-sm z-20 footer ${
          dark ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        <div className="inline-block relative w-full md:flex align-middle items-center justify-center">
          <div className="inline-block relative w-full text-left md:text-center">
            {footerLinks.map((object, index) => (
              <LinkComponent title={object.title} list={object.list} key={index} />
            ))}
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
