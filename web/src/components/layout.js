import React from 'react'

import { initGA, logPageView } from '../utils/analytics'

import Header from './header'
import Footer from './footer'

import '../styles/all.sass'

class Layout extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  render() {
    const { bgImage, children, companyInfo, siteTitle, dark } = this.props

    return (
      <>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BTKGN938N4"></script>
        <script>
          window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date()); gtag('config', 'G-BTKGN938N4');
        </script>
        <Header siteTitle={siteTitle} dark={dark} />
        <div id="modal"></div>
        <div>{children}</div>
        <Footer
          country={companyInfo.country || `USA`}
          company={companyInfo.name || `Yield`}
          socials={companyInfo.socials || []}
          email={companyInfo.email || `info@yield.is`}
          city={companyInfo.city || `Chicago`}
          dark={dark}
        />
        {bgImage ? (
          <div
            className="background-image inline-block fixed bottom-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover'
            }}
          ></div>
        ) : null}
      </>
    )
  }
}

export default Layout
