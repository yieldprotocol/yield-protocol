import React from 'react'

import Button from './button'
import Logo from './logo'

const linkClass = 'inline-block relative text-xs md:text-base text-gray-700 leading-3 mr-2 md:mr-4'

const Header = class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      isTop: false
    }

    this.isTopChecker = this.isTopChecker.bind(this)
  }

  isTopChecker() {
    const isTop = window.scrollY < 50
    if (isTop !== this.state.isTop) {
      this.setState({ isTop })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.isTopChecker)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.isTopChecker)
  }

  render() {
    const { company } = this.props

    const RightNav = () => (
      <div className="relative w-auto tl tr-l">
        <Button external primary text="Use app" to="https://app.yieldprotocol.com/" />
      </div>
    )

    const links = [
      {
        link: '//app.yieldprotocol.com/#/borrow',
        title: 'Borrow'
      },
      {
        link: '//app.yieldprotocol.com/#/lend',
        title: 'Lend'
      },
      {
        link: '//app.yieldprotocol.com/#/pool',
        title: 'Provide Liquidity'
      },
      {
        link: '//docs.yieldprotocol.com/',
        title: 'Docs'
      },
      {
        link: '//app.yield.is/',
        title: 'V1'
      },
    ]

    return (
      <nav
        aria-label="main-navigation"
        className={`navbar inline-block fixed w-full left-0 top-0 z-20 border-none font-display ${
          this.state.isTop ? `bg-transparent py-8` : `bg-white py-4`
        }`}
        role="navigation"
      >
        <div className={`mx-auto px-5 md:px-12`}>
          <div className="flex w-full justify-between items-center">
            {/* Left */}
            <div className="flex w-auto justify-start items-center">
              <Logo company={company} />
              <div className="text-right md:text-center w-full md:w-auto">
                {links.map(item => (
                  <a
                    className={linkClass}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={item.title}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="hidden md:inline-block relative tr">
              <RightNav />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
