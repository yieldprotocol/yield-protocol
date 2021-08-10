import React from 'react'
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

function ucfirst(str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`
}

function RoleList({ items }) {
  return (
    <div className="inline-block relative w-full">
      <ul className="inline-block md:flex align-middle justify-start w-full">
        {items.map(item => (
          <li className="inline-block relative w-full md:w-auto mb-4 mr-0 md:mr-8" key={item._key}>
            <div className="inline-block relative">
              <div className="inline-block relative align-middle">
                {item.person && item.person.image && item.person.image.asset && (
                  <img
                    className="w-12 h-12 rounded-full fit inline-block mr-4"
                    src={imageUrlFor(buildImageObj(item.person.image)).url()}
                    alt={item.person.name || `No name`}
                  />
                )}
                <strong className="inline-block relative w-auto">{(item.person && item.person.name) || <em>Missing</em>}</strong>
              </div>
            </div>
            {/* <div>
              {item.roles && (
                <div>
                  {item.roles.map((role, idx) => {
                    switch (true) {
                      case idx === 0:
                        return <span key={role}>{ucfirst(role)}</span>
                      case idx === item.roles.length - 1:
                        return <span key={role}> & {role}</span>
                      default:
                        return <span key={role}>, {role}</span>
                    }
                  })}
                </div>
              )}
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoleList
