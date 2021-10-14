import React from 'react'

import Background from '../components/background'
import Container from '../components/container'
import Logo from '../components/logo'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const classLinks =
  'flex justify-start items-center w-auto font-normal text-sm inherit mb-2 md:mb-0 mr-0 md:mr-8 link py-1'

const socials = [
  {
    title: 'Twitter',
    image: '/social/twitter.svg',
    url: 'https://twitter.com/yield'
  },
  {
    title: 'LinkedIn',
    image: '/social/linkedin.svg',
    url: 'https://www.linkedin.com/company/yield-protocol/about/'
  },
  {
    title: 'Github',
    image: '/social/github-black.svg',
    url: 'https://github.com/yieldprotocol'
  },
  {
    title: 'Discord',
    image: '/social/discord.svg',
    url: 'https://discord.gg/JAFfDj5'
  }
]

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
  }
  // {
  //   title: 'Resources',
  //   list: [
  //     {
  //       external: true,
  //       title: 'Blog',
  //       link: 'https://medium.com/yield-protocol'
  //     },
  //     {
  //       external: true,
  //       title: 'White paper',
  //       link: '/Yield.pdf'
  //     },
  //     {
  //       external: true,
  //       title: 'YieldSpace Paper',
  //       link: '/YieldSpace.pdf'
  //     }
  //   ]
  // }
]

const LinkComponent = ({ title, list }) =>
  list.map((item, index) =>
    item.external ? (
      <a className={classLinks} target="_blank" href={item.link} key={`link-external-${index}`}>
        {item.image ? (
          <img className="inline-block align-middle mr-2 h-4 w-4 contain" src={item.image} />
        ) : null}{' '}
        {item.title} {item.cta}
      </a>
    ) : (
      <Link className={classLinks} to={item.link} key={`link-internal-${index}`}>
        {item.title}
      </Link>
    )
  )

const NotFoundPage = () => (
  <Layout hideHeader hideFooter>
    <SEO title="Yield Protocol" />
    <header className="flex align-middle justify-center p-8 text-center fixed top-0 bg-transparent w-full">
      <Logo company="Yield Protocol" margin="m-0" />
    </header>
    <Container>
      <div className="flex align-middle justify-center h-screen w-full py-24 md:py-48 text-center relative z-10">
        <div className="flex flex-col align-middle justify-center w-full max-w-3xl">
          <h1 className="text-2xl lg:text-5xl font-semibold">Yield Protocol</h1>
          <h2 className="text-sm lg:text-xl text-gray-600 mb-8">We'll be live with Yield Protocol Version 2 soon!</h2>
          <div className="flex flex-col md:flex-row items-center justify-center w-full text-center">
            {footerLinks.map((object, index) => (
              <LinkComponent title={object.title} list={object.list} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 left-0 top-0 opacity-25">
        <Background />
      </div>
    </Container>
  </Layout>
)

export default NotFoundPage
