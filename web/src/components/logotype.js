import React from 'react'
import { Link } from 'gatsby'

const Logotype = ({ company, dark = true }) => (
  <Link
    className="inline-block text-white font-semibold link font-display mr-4"
    title={company}
    to="/"
  >
    <img
      className="inline-block align-middle mr-4 h-4"
      alt={company}
      src={dark ? '/type-white.svg' : '/type.svg'}
    />
  </Link>
)

export default Logotype
