import { format, distanceInWords, differenceInDays } from 'date-fns'
import React from 'react'
import Modal from 'react-modal'
import { ArrowUpRight, X } from 'react-feather'

import BlockContent from './block-content'
import Button from './button'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-200 mb-4'

if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

class Careers extends React.Component {
  constructor(props) {
    super(props)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.state = {
      modalIsOpen: false,
      listing: {}
    }
  }

  openModal(listing) {
    this.setState({
      modalIsOpen: true,
      listing: listing
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      listing: {}
    })
  }

  render() {
    const { modalIsOpen, listing } = this.state
    const { nodes } = this.props
    return (
      <>
        <Modal
          contentLabel="Viewing career posting"
          onRequestClose={() => this.closeModal()}
          overlayClassName="modal-overlay"
          className="modal text-left text-black"
          isOpen={modalIsOpen}
        >
          <button
            className="absolute right-0 top-0 align-middle p-2 bg-gray-700 rounded-full overflow-hidden m-4 h-8 w-8 close"
            onClick={() => this.closeModal()}
          >
            <X className="h-full w-full relative" color="white" />
          </button>
          {listing ? (
            <div className="inline-block relative w-full text-white">
              {listing.title ? (
                <h2 className="font-bold text-xl md:text-3xl text-white">{listing.title}</h2>
              ) : null}
              {listing.publishedAt ? (
                <small className="inline-block relative w-full text-gray-400 text-sm my-4 md:my-6">
                  Posted on:{' '}
                  {differenceInDays(new Date(listing.publishedAt), new Date()) > 3
                    ? distanceInWords(new Date(listing.publishedAt), new Date())
                    : format(new Date(listing.publishedAt), 'MMMM Do YYYY')}
                </small>
              ) : null}
              {listing._rawBody ? (
                <div className={`${ParagraphClass} mb-8 list`}>
                  <BlockContent blocks={listing._rawBody || []} />
                </div>
              ) : null}
              <a
                className="block text-center rounded-lg border-2 border-solid border-indigo-700 bg-indigo-700 text-white font-bold px-4 py-2 w-full"
                target="_blank"
                href={
                  listing.apply
                    ? listing.apply
                    : `mailto:contact@yield.is?subject=${
                        listing && listing.title ? listing.title : ''
                      }`
                }
                rel="noopener noreferrer"
              >
                Apply
              </a>
            </div>
          ) : (
            <div>
              <p className={ParagraphClass}>Woops, couldn't load this link, please try again!</p>
            </div>
          )}
        </Modal>
        {nodes && nodes.length > 0 ? (
          nodes.map((career, index) => (
            <div
              className={`inline-block relative w-full py-8 text-left ${
                index === nodes.length - 1 ? '' : 'border-b border-gray-700'
              }`}
              key={`career-${index}`}
            >
              <div className="inline-block md:flex justify-between items-center w-full">
                <div className="inline-block relative w-full mr-0 md:mr-8">
                  <strong className="inline-block relative w-full text-lg md:text-xl mb-4 font-medium">
                    {career.title}
                  </strong>
                  <p className={ParagraphClass}>{career.excerpt}</p>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <button
                    className="inline-flex items-center text-center rounded-lg border-2 border-solid border-white bg-transparent text-white px-2 md:px-4 py-1 md:py-2 font-bold hover:bg-indigo-700 mr-4"
                    onClick={() => this.openModal(career)}
                  >
                    View
                  </button>
                  <a
                    className="bg-gray-500 rounded-full overflow-hidden h-8 w-8 p-1"
                    target="_blank"
                    href={`/careers/${career.slug.current}`}
                  >
                    <ArrowUpRight className="h-full w-full relative" color="white" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="inline-block relative w-full mt-12">
            <Button outlined external text="Get in touch" to={`mailto:contact@yield.is`} />
          </div>
        )}
      </>
    )
  }
}

export default Careers
