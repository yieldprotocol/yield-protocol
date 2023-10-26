import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'

// Libs
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

// Components
import GraphQLErrorList from '../components/graphql-error-list'
import Background from '../components/background'
import Button from '../components/button'
import SEO from '../components/seo'

// Layout
import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool-v2.json'

// Utils
import { logEvent } from '../utils/analytics'

// fyDai ABI
const fyDai = [
  'function maturity() view returns (uint256)',
  'function isMature() view returns(bool)',
  'function mature()',
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function redeem(address, address, uint256)'
]

const series = [
  {
    address: '0xeCc2cB297e039f34a62b0a314a1C67121d58B07c',
    label: 'Dec 2021',
    date: 'Dec 2021',
    value: '1640995199',
    name: 'Yield FYDAI2112 LP Token',
    type: 'DAI',
    apr: 0
  },
  {
    address: '0x792F187521fA24e35440BF8a7Db76f9ee0E719ee',
    label: 'Mar 2022',
    date: 'Mar 2022',
    value: '1648771199',
    name: 'Yield FYDAI2203 LP Token',
    type: 'DAI',
    apr: 0
  },
  {
    address: '0xE77339Cd02eDf4Ec6d030dAE6CB1725cEA70b652',
    label: 'Jun 2022',
    date: 'Jun 2022',
    value: '1656036000',
    name: 'Yield FYDAI2206 LP Token',
    type: 'DAI',
    apr: 0
  },
  {
    address: '0xC7d9E66D34f7C743E9C46Cb6b386D32719477330',
    label: 'Dec 2021',
    date: 'Dec 2021',
    value: '1640995199',
    name: 'Yield FYUSDC2112 LP Token',
    type: 'USDC',
    apr: 0
  },
  {
    address: '0x3994729c74ea858D3F756744D76f7D4E4Cd39969',
    label: 'Mar 2022',
    date: 'Mar 2022',
    value: '1648771199',
    name: 'Yield FYUSDC2203 LP Token',
    type: 'USDC',
    apr: 0
  },
  {
    address: '0x4fc50Fb7EEf73b8bD7262B7eC4E6801234D8e742',
    label: 'Jun 2022',
    date: 'Jun 2022',
    value: '1656036000',
    name: 'Yield FYUSDC2206 LP Token',
    type: 'USDC',
    apr: 0
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
      sort: { fields: _createdAt }
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

    companyInfo: sanityCompanyInfo(_id: { regex: "/(drafts.|)companyInfo/" }) {
      socials {
        title
        image {
          asset {
            _id
          }
        }
        url
      }
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props

  const [seriesArray, setSeriesArray] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

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
      // You can use any standard network name
      //  - "homestead"
      //  - "rinkeby"
      //  - "ropsten"
      //  - "kovan"
      //  - "goerli"
      provider = ethers.getDefaultProvider('kovan', {
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
        console.log({ x })
        const contract = new ethers.Contract(x.address, Pool.abi, provider)
        const fyDaiAddress = await contract.fyDai()
        console.log({ fyDaiAddress })
        const fyDaiContract = new ethers.Contract(fyDaiAddress, fyDai, provider)
        const fyDaiMaturity = await fyDaiContract.maturity()
        const parsedfyDaiMaturity = new Date(parseInt(fyDaiMaturity.toString()) * 1000)

        const amount = 1
        const parsedAmount = ethers.BigNumber.isBigNumber(amount)
          ? amount
          : ethers.utils.parseEther(amount.toString())

        const preview = await contract.sellFYTokenPreview(parsedAmount)
        console.log({ preview })

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

    console.log({ ratesData, filteredRates })

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
    console.log({ rates })
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
    // Get these imports if browser
    getImports().then(() => {
      // Get series rates and update
      updateSeries().then(() => {
        if (isMounted) {
          setIsDisabled(false)
          setIsLoading(false)
        }
      })
    })
  }, [])

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
  const socials = (data || {}).companyInfo.socials

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

  const ForComponent = ({ header, array, className }) => {
    return (
      <div className={`p-8 md:p-16 w-full text-center ${className}`}>
        <h3 className="inline-block w-full font-medium text-2xl md:text-3xl mb-4">{header}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {array &&
            array.map((object, index) => (
              <div className="bg-gray-800 p-4 w-full font-normal" key={index}>
                <div className="flex justify-start items-center w-16 h-16 rounded-full bg-offwhite p-3 mb-6 mx-auto">
                  <img className="w-full" src={imageUrlFor(buildImageObj(object.image))} />
                </div>
                <strong className="inline-block w-full font-bold font-medium text-lg mb-2">
                  {object.title}
                </strong>
              </div>
            ))}
        </div>
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

      {/* Hero */}
      <section className="hero flex flex-col md:flex-row items-center justify-center h-auto md:h-screen text-left bg-transparent">
        <div
          className={`relative mt-24 md:mt-0 mb-8 md:mb-0 px-0 md:px-12 ${centered}`}
          style={{
            zIndex: 1
          }}
        >
          <h1 className="font-medium text-3xl md:text-5xl mb-4">{page.heading}</h1>
          <p className="text-gray-600 mb-8">{page.body}</p>
          {page.ctaPrimary ? (
            <Button external primary text={page.ctaPrimary} type="button" to={page.ctaPrimaryURL} />
          ) : null}
        </div>
        <Background />
      </section>
      {/* App */}
      {/* <section className="flex items-center justify-center h-auto py-12 text-left bg-white">
        <div className={centered}>
          <div className="w-full p-4 md:p-8 border-2 border-gray-100 text-gray-600">
            <h2 className="font-medium text-3xl mb-4 text-black">Yield Protocol Live Rates</h2>
            {!isLoading && seriesArray && seriesArray[0] ? (
              <div className="block">
                {seriesArray.map((series, index) => (
                  <div
                    className="flex justify-between flex-col md:flex-row w-full items-center py-2 text-left mb-4 md:mb-0"
                    key={`series-${index}`}
                  >
                    <div className="flex justify-start text-lg items-center w-full md:w-auto mb-4 md:mb-0">
                      {series.type === 'DAI' ? (
                        <img className="w-6 h-6 rounded-full mr-4" src="img/dai.svg" />
                      ) : (
                        <img className="w-6 h-6 rounded-full mr-4" src="img/usdc.svg" />
                      )}
                      <strong className="mr-2 text-black">
                        {series.apr} APR, {series.date} Series
                      </strong>
                    </div>
                    <div className="right">
                      <a
                        className="inline-block relative w-auto bg-white text-black border border-black font-bold py-3 px-8 link font-medium mr-3"
                        disabled={isDisabled}
                        href={`//app.yield.is/#/borrow/${series.value}`}
                        target="_blank"
                        onClick={() =>
                          logEvent({
                            category: 'Landing Page',
                            action: 'Borrow',
                            label: amount ? amount : null
                          })
                        }
                      >
                        Borrow
                      </a>
                      <a
                        className="inline-block relative w-auto bg-black text-white border border-black font-bold py-3 px-8 link font-medium"
                        disabled={isDisabled}
                        href={`//app.yield.is/#/lend/${series.value}`}
                        target="_blank"
                        onClick={() =>
                          logEvent({
                            category: 'Landing Page',
                            action: 'Lend',
                            label: amount ? amount : null
                          })
                        }
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
      </section> */}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {page.backers &&
                page.backers.map((backer, index) => (
                  <img
                    className={`w-full fit ${
                      index === page.backers.length - 1 ? 'mb-4 md:mr-0' : 'mb-4 md:mr-6'
                    }`}
                    key={`backer-${index}`}
                    src={imageUrlFor(buildImageObj(backer))}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="flex py-12 text-center team bg-offwhite">
        <div className={centered}>
          <h4 className="font-medium text-2xl mb-8">Our team</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {people && people.edges
              ? people.edges.slice(0,2).map((person, index) => (
                  <div
                    className={`inline-block w-full text-left ${
                      index === people.edges.length - 1 ? 'mb-0' : 'mb-4'
                    }`}
                    key={`team-${index}`}
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
                          <img className="h-4 mr-2" src="/social/twitter.svg" />
                          Twitter
                        </a>
                      ) : null}
                      {person.node.linkedin ? (
                        <a className="flex items-center justify-start" href={person.node.linkedin}>
                          <img className="h-4 mr-2" src="/social/linkedin.svg" />
                          LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              : null}
          </div>

          <h4 className="font-medium text-2xl mb-8">Contributors</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {people && people.edges
              ? people.edges.slice(3).map((person, index) => (
                  <div
                    className={`inline-block w-full text-left ${
                      index === people.edges.length - 1 ? 'mb-0' : 'mb-4'
                    }`}
                    key={`team-${index}`}
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
                          <img className="h-4 mr-2" src="/social/twitter.svg" />
                          Twitter
                        </a>
                      ) : null}
                      {person.node.linkedin ? (
                        <a className="flex items-center justify-start" href={person.node.linkedin}>
                          <img className="h-4 mr-2" src="/social/linkedin.svg" />
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
      {/* Community */}
      <section className="flex py-12 bg-white community">
        <div className={centered}>
          <h5 className="font-medium text-2xl mb-4">Join our community</h5>
          <p className="w-full text-gray-600 mb-8">
            Chat with us and others in the community to learn more about Yield Protocol.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socials &&
              socials.map((social, index) => (
                <a
                  className="w-full bg-offwhite hover:bg-gray-100 p-8 text-black text-center"
                  href={social.url}
                  target="_blank"
                  key={`social-${index}`}
                >
                  <img
                    className="w-6 h-6 mx-auto mb-4"
                    key={`person-${index}`}
                    src={imageUrlFor(buildImageObj(social.image))}
                  />
                  <span>{social.title}</span>
                </a>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
