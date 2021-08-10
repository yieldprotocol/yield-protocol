import React from 'react'

const Container = ({ children, className }) => {
  return <section className={`container mx-auto px-5 py-5 leading-relaxed ${className ? className : ''}`}>{children}</section>
}

export default Container
