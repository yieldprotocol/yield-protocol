import React from 'react'
import { Link } from 'gatsby'

const Logo = ({ company, dark = false }) => (
  <Link
    className="inline-block text-white font-semibold link font-display mr-4"
    title={company}
    to="/"
  >
    <img
      className="inline-block align-middle mr-4 h-6"
      alt={company}
      src={dark ? '/logo-white.svg' : '/logo.svg'}
    />
  </Link>
)

export default Logo
