import React from 'react'
import { Link } from 'gatsby'

const Logo = ({ company, dark = false, margin = 'mr-4' }) => (
  <Link
    className={`inline-block text-white font-semibold link font-display ${margin}`}
    title={company}
    to="/"
  >
    <img
      className={`inline-block align-middle h-6 ${margin}`}
      alt={company}
      src={dark ? '/logo-white.svg' : '/logo.svg'}
    />
  </Link>
)

export default Logo
