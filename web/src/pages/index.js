import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import Modal from 'react-modal'
import { X } from 'react-feather'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Select from 'react-select'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
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
    label: 'September 2021 • APR:',
    date: 'September 2021',
    apr: 2.84
  },
  {
    address: '0x5591f644B377eD784e558D4BE1bbA78f5a26bdCd',
    value: '1640995199',
    label: 'December 2021 • APR:',
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
      _rawBody
      mainImage {
        asset {
          _id
        }
      }
      _rawAudit
      ctaPrimary
      ctaPrimaryURL
      ctaSecondary
      ctaSecondaryURL
      stats {
        stat
        title
        description
        url
        image {
          asset {
            _id
          }
        }
      }
      showBlog
      mainCTA
      mainCTAURL
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
          series[foundIndex].label = `${series[foundIndex].label} ${setAPR}`
        }
      })
    }
    // setTimeout(() => selectRef.current.select.focus(), 1)
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
        setIsDisabled(false)
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
      label: `Type: ${tab.cta}, Series: ${selectedSeries.label} • APR: ${selectedSeries.apr}, Amount: ${amount}`
    })
  }

  return (
    <Layout dark>
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

      <ContainerFull padding="p-0">
        <div className="h-full app">
          {/* Form */}
          <div className="pt-32 pb-4 md:py-32 px-5 md:px-12 series text-center">
            <div className="block mx-auto max-w-xs mb-4 md:mb-8">
              <p className="text-orange-300 font-bold tracking-widest text-xl md:text-3xl uppercase m-0">
                {selectedSeries.date}
              </p>
              <h1 className="text-5xl md:text-6xl font-semibold p-0 m-0">{selectedSeries.apr}%</h1>
              <strong className="block text-xs uppercase text-indigo-600 tracking-widest mb-2">
                Change series
              </strong>
              <Select
                className="select"
                isSearchable={false}
                isDisabled={isDisabled}
                isLoading={isLoading}
                onChange={selectedSeries => switchSeries(selectedSeries)}
                isMulti={false}
                options={series}
                value={selectedSeries}
                ref={selectRef}
              />
              <Tabs className="my-8" onSelect={index => switchTabs(index)}>
                <TabList className="flex align-middle justify-center rounded-full w-auto">
                  <Tab>{borrow.cta}</Tab>
                  <Tab>{lend.cta}</Tab>
                </TabList>
                <TabPanel className="hidden">&nbsp;</TabPanel>
                <TabPanel className="hidden">&nbsp;</TabPanel>
              </Tabs>
              <form onSubmit={e => formSubmit(e)}>
                <label htmlFor="amount">Amount of DAI to {tab.cta}</label>
                <input
                  className="inline-block relative w-full px-2 py-1 bg-transparent border-2 rounded-md border-indigo-500"
                  type="number"
                  onChange={event => setAmount(event.target.value)}
                  value={amount}
                  id="amount"
                />
                <button
                  className="inline-block relative w-full rounded-md bg-white text-indigo-700 font-bold py-3 px-8 my-4 link"
                  disabled={isDisabled}
                  type="submit"
                >
                  {tab.cta} {amount} DAI
                </button>
              </form>
            </div>
          </div>
          {/* Right  */}
          <div className="py-12 md:py-48 px-5 md:px-12 bg-indigo-800 interest md:h-full">
            <h2 className="text-2xl font-semibold mb-4">{tab.heading}</h2>
            <p className="text-sm text-gray-500 tracking-wide mb-8">
              Interest rates shown are market rates and are subject to change. Your rate may vary
              based on the amount borrowed. Rates shown are for information purposes only.
            </p>
            <hr className="w-12 border-4 border-white rounded-full mx-0 my-4" />
            <button className={classLinks} onClick={() => openModal()}>
              Sign up for our mailing list
            </button>
          </div>
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
