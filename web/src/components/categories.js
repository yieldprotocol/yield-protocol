import React from 'react'
import { Link } from 'gatsby'

const SubheadingClass = 'inline-block relative w-full text-sm text-gray-400 font-medium mb-4'

const Categories = props => {
  const { categories } = props
  return (
    <div className="inline-block relative w-full">
      <h3 className={SubheadingClass}>Categories</h3>
      <ul className="inline-flex relative w-full">
        {categories.map(category => (
          <li className="inline-block relative w-auto mr-4 underline" key={category._id}>
            <Link to={`/categories/${category.slug.current}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categories
