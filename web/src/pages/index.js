import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import Modal from 'react-modal'
import { X } from 'react-feather'
import Dai from '/static/img/dai.svg'

import { logEvent } from '../utils/analytics'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool.json'

if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

// fyDai ABI
const fyDai = [
  'function maturity() view returns (uint256)',
  'function isMature() view returns(bool)',
  'function mature()',
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function redeem(address, address, uint256)'
]

const classLinks =
  'flex justify-items-start items-center flex-row align-middle w-full font-normal inherit text-base mb-2 md:mb-0 mr-0 md:mr-8 link py-1'

const borrow = {
  heading: 'Borrow today & pay fixed interest.',
  type: 'borrow',
  cta: 'Borrow'
}

const lend = {
  heading: 'Lend today & earn fixed interest.',
  type: 'lend',
  cta: 'Lend'
}

const series = [
  {
    address: '0x8EcC94a91b5CF03927f5eb8c60ABbDf48F82b0b3',
    value: '1633046399',
    label: 'September 2021',
    date: 'September 2021',
    apr: 2.84
  },
  {
    address: '0x5591f644B377eD784e558D4BE1bbA78f5a26bdCd',
    value: '1640995199',
    label: 'December 2021',
    date: 'December 2021',
    apr: 3.84
  }
]

export const query = graphql`
  query IndexPageQuery {
    companyInfo: sanityCompanyInfo(_id: { regex: "/(drafts.|)companyInfo/" }) {
      country
      socials {
        title
        image {
          asset {
            _id
          }
        }
        url
      }
      email
      city
      name
    }

    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      image {
        asset {
          _id
        }
      }
      keywords
    }

    page: sanityHome(_id: { regex: "/(drafts.|)home/" }) {
      id
      title
      heading
      body
      mainImage {
        asset {
          _id
        }
      }
      ctaPrimary
      ctaPrimaryURL
      ctaSecondary
      ctaSecondaryURL
      borrowersText {
        title
        image {
          asset {
            _id
          }
        }
      }
      lendersText {
        title
        description
      }
      backersHeading
      backers {
        asset {
          _id
        }
      }
    }

    people: allSanityPerson(
      sort: { fields: _updatedAt }
      filter: { slug: { current: { ne: null } } }
    ) {
      edges {
        node {
          id
          name
          title
          _rawBio
          image {
            asset {
              _id
            }
          }
          slug {
            current
          }
          twitter
          linkedin
        }
      }
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props

  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState(series[0])
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(100)
  const [tab, setTab] = useState(borrow)
  const [seriesArray, setSeriesArray] = useState([])

  const selectRef = useRef()

  // Reducer
  function reducer(state, action) {
    switch (action.type) {
      case 'updateRates':
        return {
          ...state,
          seriesRates: action.payload
        }
      default:
        return state
    }
  }

  // Seconds per year
  const secondsPerYear = 365.25 * 24 * 60 * 60

  // Set state for yield
  const initState = {
    seriesRates: new Map()
  }

  const [state, dispatch] = React.useReducer(reducer, initState)

  // Update imports
  let ethers
  let provider
  const getImports = async () => {
    if (process.browser && typeof window !== 'undefined') {
      ethers = require('ethers')

      // Default provider (homestead = mainnet)
      provider = ethers.getDefaultProvider('homestead', {
        etherscan: process.env.GATSBY_ETHERSCAN_API_KEY,
        infura: process.env.GATSBY_INFURA_PROJECT_ID,
        alchemy: process.env.GATSBY_ALCHEMY_API_KEY
      })
    }
  }

  // Round function
  function roundToTwo(num) {
    return +(Math.round(num + 'e+2') + 'e-2')
  }

  // Get the yield market rates for a particular set of series
  const _getRates = async series => {
    const ratesData = await Promise.allSettled(
      series.map(async x => {
        const contract = new ethers.Contract(x.address, Pool.abi, provider)

        const fyDaiAddress = await contract.fyDai()
        const fyDaiContract = new ethers.Contract(fyDaiAddress, fyDai, provider)
        const fyDaiMaturity = await fyDaiContract.maturity()
        const parsedfyDaiMaturity = new Date(parseInt(fyDaiMaturity.toString()) * 1000)

        const amount = 1
        const parsedAmount = ethers.BigNumber.isBigNumber(amount)
          ? amount
          : ethers.utils.parseEther(amount.toString())

        const preview = await contract.sellFYDaiPreview(parsedAmount)

        const inEther = ethers.utils.formatEther(preview.toString())
        const object = {
          address: x.address,
          maturity: parsedfyDaiMaturity,
          isMature: parsedfyDaiMaturity < Math.round(new Date().getTime() / 1000),
          sellPreview: inEther
        }
        return object
      }, state.seriesRates)
    )

    const filteredRates = ratesData.filter(p => {
      return p.status === 'fulfilled'
    })

    /* update context state and return */
    dispatch({ type: 'updateRates', payload: filteredRates })
    return filteredRates
  }

  // Annualized yield rate
  const yieldAPR = (
    _rate,
    _maturity,
    _fromDate = Math.round(new Date().getTime() / 1000) // if not provided, defaults to current time.
  ) => {
    if (_maturity > Math.round(new Date().getTime() / 1000)) {
      const secsToMaturity = _maturity / 1000 - _fromDate
      const propOfYear = secsToMaturity / secondsPerYear
      const setReturn = parseFloat(1.0) // override to use float
      const priceRatio = setReturn / _rate
      const powRatio = 1 / propOfYear
      const apr = Math.pow(priceRatio, powRatio) - 1
      return apr * 100
    }
    return 0
  }

  // Update list
  const updateSeries = async () => {
    const rates = await _getRates(series)
    if (rates && rates.length > 0) {
      rates.map(object => {
        const getAPR = yieldAPR(
          object.value.sellPreview, // _rate
          object.value.maturity // _maturity
        )
        const maturity = new Date(object.value.maturity)
        const maturityYear = maturity.getUTCFullYear()
        const maturityMonth = maturity.getUTCMonth() + 1
        const maturityDate = maturity.getUTCDate()
        const setDate = `${maturityYear}/${maturityMonth}/${maturityDate}`
        console.log(
          `APR: ${getAPR} for ${object.value.address}, sellPreview: ${object.value.sellPreview}, maturing on ${setDate}`
        )
        const foundIndex = series.findIndex(s => {
          return s.address === object.value.address
        })
        if (foundIndex > -1) {
          const setAPR = roundToTwo(getAPR)
          series[foundIndex].apr = setAPR
          series[foundIndex].label = `${series[foundIndex].label} (${setAPR}%)`
        }
      })
    }
    setSeriesArray(series)
  }

  // Run on page load
  useEffect(() => {
    // Set mounted
    let isMounted = true
    // Set var for timer
    let timer
    // Get these imports if browser
    getImports()
    // Get series rates and update
    updateSeries().then(() => {
      if (isMounted) {
        // Timer
        if (selectRef && selectRef.current && selectRef.current.select) {
          timer = setTimeout(
            () => selectRef && selectRef.current && selectRef.current.select.focus(),
            25
          )
        }
        setIsLoading(false)
      }
    })
    // this will clear Timeout when component unmount like in willComponentUnmount
    return () => {
      clearTimeout(timer)
      isMounted = false
    }
  }, [])

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site
  const page = (data || {}).page
  const people = (data || {}).people

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  if (!page) {
    throw new Error(
      'Missing "Pages > Home". Open the studio at http://localhost:3333 and add some content to "Pages > Home" and restart the development server.'
    )
  }

  const SignupForm = ({ status, message, onValidated }) => {
    let email
    const submit = e => {
      e.preventDefault()
      email &&
        email.value.indexOf('@') > -1 &&
        onValidated({
          EMAIL: email.value
        })
    }

    return (
      <form className="inline-block relative w-full" onSubmit={submit}>
        <input
          placeholder="Your email"
          className="inline-block relative w-full p-4 bg-white text-gray-600 mb-4 rounded border border-2 border-gray-300"
          ref={node => (email = node)}
          type="email"
        />
        <button
          className="inline-block relative w-full p-4 rounded font-bold bg-indigo-700 text-white"
          onClick={submit}
          type="submit"
        >
          Submit
        </button>
        {status ? (
          <div className="inline-block relative w-full text-xs">
            {status === 'sending' && (
              <div className="inline-block relative w-full mt-4 text-gray-600">Subscribing...</div>
            )}
            {status === 'error' && (
              <div
                className="inline-block relative w-full mt-4 text-yellow-500"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}
            {status === 'success' && (
              <div
                className="inline-block relative w-full mt-4 text-green-400"
                dangerouslySetInnerHTML={{ __html: message }}
              />
            )}
          </div>
        ) : null}
      </form>
    )
  }

  const switchSeries = series => {
    console.log('Switched series:', series)
    setSelectedSeries(series)
    logEvent({
      category: 'Landing Page',
      action: 'Switched Series',
      label: `Switched to ${series.date} • ${series.apr}`
    })
  }

  const switchTabs = index => {
    let tab
    switch (index) {
      case 1:
        tab = lend
        break
      default:
        tab = borrow
        break
    }
    console.log('Switched to:', tab)
    setTab(tab)
    logEvent({
      category: 'Landing Page',
      action: 'Switched Tab',
      label: `Switched to ${tab.cta}`
    })
    return tab
  }

  const formSubmit = e => {
    e.preventDefault()
    console.log('form submitted, amount, series, tab', amount, selectedSeries, tab)
    if (typeof window) {
      window.open(`//app.yield.is/#/${tab.type}/${selectedSeries.value}/${amount}`)
    }
    if (tab.type === 'borrow') {
      logEvent({
        category: 'Landing Page',
        action: 'Borrow',
        label: amount ? amount : 'Borrow'
      })
    } else if (tab.type === 'lend') {
      logEvent({
        category: 'Landing Page',
        action: 'Lend',
        label: amount ? amount : 'Lend'
      })
    }
    logEvent({
      category: 'Landing Page',
      action: 'Used App',
      label: `Type: ${tab.cta}, Series: ${selectedSeries.label} (${selectedSeries.apr}), Amount: ${amount}`
    })
  }

  const ForComponent = ({ header, array, className }) => {
    return (
      <div className={`p-8 md:p-16 w-full ${className}`}>
        <h3 className="inline-block w-full font-medium text-2xl md:text-3xl mb-4">{header}</h3>
        {array &&
          array.map((object, index) => (
            <div
              className={`flex flex-col md:flex-row items-center w-full font-normal ${
                index === page.borrowersText.length - 1 ? 'mb-0' : 'mb-4'
              }`}
              key={index}
            >
              <div className="flex justify-start items-center w-10 h-10 rounded-full bg-white p-2 mb-4 md:mr-4">
                <img className="w-full" src={imageUrlFor(buildImageObj(object.image))} />
              </div>
              <strong className="inline-block w-full font-bold font-medium text-lg mb-2">
                {object.title}
              </strong>
            </div>
          ))}
      </div>
    )
  }

  const centered = 'block mx-auto w-full max-w-4xl px-5'

  return (
    <Layout>
      <SEO
        title={page.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />

      <Modal
        overlayClassName="modal-overlay"
        contentLabel="Mailing list"
        className="modal text-left text-black relative leading-relaxed"
        isOpen={modalIsOpen}
      >
        <button
          className="absolute right-0 top-0 align-middle p-2 bg-black rounded-full overflow-hidden m-4 close"
          onClick={() => closeModal()}
        >
          <X className="h-full w-full relative" color="white" />
        </button>
        <div className="inline-block relative w-full">
          <strong className="text-lg md:text-xl font-bold inline-block relative w-full mb-6">
            Sign up for our mailing list to keep up to date
          </strong>
          <MailchimpSubscribe
            render={({ subscribe, status, message }) => (
              <SignupForm
                onValidated={formData => subscribe(formData)}
                status={status}
                message={message}
              />
            )}
            url={
              'https://yield.us8.list-manage.com/subscribe/post?u=ba7359e990d89455a1c9be0e2&amp;id=025d8e6707'
            }
          />
        </div>
      </Modal>

      {/* Hero */}
      <section className="hero flex items-center justify-center h-screen text-left md:text-center bg-offwhite">
        <div className={centered}>
          <h1 className="font-medium text-5xl mb-4">{page.heading}</h1>
          <p className="text-gray-600 mb-8">{page.body}</p>
          {page.ctaPrimary ? (
            <Button external primary text={page.ctaPrimary} type="button" to={page.ctaPrimaryURL} />
          ) : null}
        </div>
      </section>
      {/* App */}
      <section className="flex items-center justify-center h-auto py-12 text-left bg-white">
        <div className={centered}>
          <div className="w-full p-4 md:p-8 border-2 border-gray-100 text-gray-600">
            {!isLoading && seriesArray && seriesArray[0] ? (
              <div className="block">
                {seriesArray.map((series, index) => (
                  <div
                    className="flex justify-between flex-col md:flex-row w-full items-center py-2 text-left mb-4 md:mb-0"
                    key={`series-${index}`}
                  >
                    <div className="flex justify-start text-lg items-center w-full md:w-auto mb-4 md:mb-0">
                      <img className="w-6 h-6 rounded-full mr-4" src={Dai} />
                      <strong className="mr-2 text-black">{series.apr}</strong>
                      <p>{series.date}</p>
                    </div>
                    <div className="right">
                      <a
                        className="inline-block relative w-auto bg-white text-black border border-black font-bold py-3 px-8 link font-medium mr-3"
                        disabled={isDisabled}
                        href={`//app.yield.is/#/borrow/${series.value}`}
                        target="_blank"
                      >
                        Borrow
                      </a>
                      <a
                        className="inline-block relative w-auto bg-black text-white border border-black font-bold py-3 px-8 link font-medium"
                        disabled={isDisabled}
                        href={`//app.yield.is/#/lend/${series.value}`}
                        target="_blank"
                      >
                        Lend
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              isLoading && (
                <div className="flex text-center justify-center items-center p-12 border border-gray-200">
                  Loading.…
                </div>
              )
            )}
          </div>
        </div>
      </section>
      {/* Value props */}
      <section className="flex py-0 md:py-12">
        <div className="flex flex-col md:flex-row justify-between w-full max-w-6xl mx-auto">
          <ForComponent
            header="For borrows & lenders"
            array={page.borrowersText}
            className="bg-black text-white"
          />
        </div>
      </section>
      {/* Backers */}
      <section className="flex py-12 text-center">
        <div className={centered}>
          <h3 className="font-medium text-2xl mb-8">{page.backersHeading}</h3>
          <div className="w-full relative inline-block">
            <div className="flex flex-col md:flex-row justify-start items-center">
              {page.backers &&
                page.backers.map((backer, index) => (
                  <img
                    className={`h-8 ${
                      index === page.backers.length - 1 ? 'mb-0 md:mr-0' : 'mb-4 md:mr-6'
                    }`}
                    key={`backer-${index}`}
                    src={imageUrlFor(buildImageObj(backer))}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <p>Mariano Conti from Maker, Seb &amp; Suhail from Zapper</p>
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="flex py-12 text-center team bg-offwhite">
        <div className={centered}>
          <h4 className="font-medium text-2xl mb-8">Our team</h4>
          <div className="grid md:grid-flow-col gap-4">
            {people && people.edges
              ? people.edges.map((person, index) => (
                  <div
                    className={`inline-block w-full text-left ${
                      index === people.edges.length - 1 ? 'mb-0' : 'mb-4 md:mb-0'
                    }`}
                  >
                    <img
                      className="w-full h-64 object-cover mb-3"
                      key={`person-${index}`}
                      src={imageUrlFor(buildImageObj(person.node.image))}
                    />
                    <strong className="inline-block w-full font-medium text-2xl">
                      {person.node.name}
                    </strong>
                    <p className="inlie-block w-full text-sm mb-4">{person.node.title}</p>
                    <div className="socials flex flex-row items-center justify-start text-sm text-gray-600 w-full">
                      {person.node.twitter ? (
                        <a
                          className="flex items-center justify-start mr-4"
                          href={person.node.twitter}
                        >
                          <img class="h-4 mr-2" src="/social/twitter.svg" />
                          Twitter
                        </a>
                      ) : null}
                      {person.node.linkedin ? (
                        <a className="flex items-center justify-start" href={person.node.linkedin}>
                          <img class="h-4 mr-2" src="/social/linkedin.svg" />
                          LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
