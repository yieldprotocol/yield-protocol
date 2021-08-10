import React from 'react'
import { Link } from 'gatsby'

const TabClass =
  'inline-block relative w-auto font-medium text-sm border-solid border-t-0 border-l-0 border-r-0 border-b-4 tracking-wide mr-2 md:mr-4 link py-2'

const Tabs = props => {
  const { tabs } = props
  return (
    <div>
      {tabs.map((tab, index) => (
        <Link
          className={`${TabClass} ${tab.active ? 'text-primary border-primary' : 'text-gray-500 border-white'}`}
          key={`tab-${index}`}
          to={tab.to}
        >
          {tab.title}
        </Link>
      ))}
    </div>
  )
}

export default Tabs
