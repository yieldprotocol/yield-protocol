import React from 'react'
import { Link } from 'gatsby'

import Logotype from './logotype'
import Button from './button'

const linkClass = 'inline-block relative text-xs md:text-base text-white leading-3 mr-2 md:mr-4'

const Header = class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      isTop: true
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
    const { company, dark } = this.props

    const RightNav = () => (
      <div className="relative w-auto tl tr-l">
        <Button external primary text="Use app" to="https://app.yield.is" />
      </div>
    )

    const links = [
      {
        link: '//app.yield.is/#/borrow/',
        title: 'Borrow'
      },
      {
        link: '//app.yield.is/#/lend/',
        title: 'Lend'
      },
      {
        link: '//app.yield.is/#/pool/',
        title: 'Provide Liquidity'
      }
    ]

    return (
      <nav
        aria-label="main-navigation"
        className={`navbar inline-block fixed w-full left-0 top-0 z-20 border-none font-display ${
          this.state.isTop ? `py-8` : `py-4`
        } ${dark ? 'dark text-gray-300' : 'text-gray-600'}`}
        role="navigation"
      >
        <div className={`mx-auto px-5 md:px-12`}>
          <div className="flex w-full justify-between items-center">
            {/* Left */}
            <Logotype company={company} dark={dark} />
            <div className="text-right md:text-center w-full md:w-auto">
              {links.map(item => (
                <a
                  className={linkClass}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.title}
                  style={{
                    top: '0.1rem'
                  }}
                >
                  {item.title}
                </a>
              ))}
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
