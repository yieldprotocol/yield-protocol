import React from 'react'

const ContainerFull = ({ children, padding, className, style }) => {
  return (
    <section
      className={`inline-block relative w-full min-h-screen md:h-screen text-white leading-relaxed z-10 overflow-hidden ${
        className ? className : ''
      } ${padding ? padding : ' py-32 px-5 md:px-12'}`}
      style={style}
    >
      {children}
    </section>
  )
}

export default ContainerFull
