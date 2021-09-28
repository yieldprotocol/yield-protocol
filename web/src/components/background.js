import React, { useEffect, useRef } from 'react'

const Background = props => {
  const canvasRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('js')
    const CD = {
        _el: canvasRef.current /* canvas element */
      } /* canvas data */,
      PD = {
        auni: (2 * Math.PI) / 360 /* angular unit */,
        aerr: Math.PI / 36 /* angular error */,
        prec: 3 /* decimal precision */,
        vmax: 0.02 /* maximum absolute value of velocity */,
        pnum: 400 /* total number of polygons drawn */
      } /* general polygon data */,
      PA = Array(PD.num) /* array of masking polygons we draw */,
      LA = Object.entries({
        'Wrapped Bitcoin': 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
        Ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        Dai: 'https://www.bitprime.co.nz/wp-content/uploads/2020/02/dai200.png',
        'USD Coin': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=013',
        ChainLink: 'https://cryptologos.cc/logos/chainlink-link-logo.png?v=013',
        Uniswap: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=013',
        Aave: 'https://cryptologos.cc/logos/aave-aave-logo.png?v=013',
        Compound: 'https://cryptologos.cc/logos/compound-comp-logo.png?v=013',
        'Lido Staked Ether':
          'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1608607546'
      }) /* array of logos */,
      NL = LA.length /* number of logos */,
      _L = document.getElementById('logo-img') /* logo image element */,
      FN = ['line', 'move'] /* drawing functions */

    let rID, iID

    /* randomly returns either -1 or 1 */
    function randsgn() {
      return Math.pow(-1, Math.round(Math.random()))
    }

    /* returns random number between min & max with decimal precision dec */
    function rand(max = 1, min = 0, dec = 0) {
      return +(min + (max - min) * Math.random()).toFixed(dec)
    }

    /* returns the GCD of a & b */
    /* GCD https://en.wikipedia.org/wiki/Greatest_common_divisor */
    function fgcd(a, b) {
      return b === 0 ? a : fgcd(b, a % b)
    }

    /* returns the LCM of a & b */
    /* LCM https://en.wikipedia.org/wiki/Least_common_multiple */
    function flcm(a, b) {
      return (a * b) / fgcd(a, b)
    }

    class RandPoly {
      constructor(i) {
        /* SHAPE PROPERTIES */
        this.n = rand(8, 3) /* number of vertices */
        this.β = (2 * Math.PI) / this.n /* base angle corresp to an edge */
        this.f = 0 /* polygon scaling factor */

        /* POSITION PROPERTIES */
        /* initial x,y position of polygon circumcentre */
        this.ox = rand(CD.dim, -CD.dim)
        this.oy = rand(CD.dim, -CD.dim)
        this.φ = Math.random() * 2 * Math.PI /* initial polygon rotation */

        /* MOTION PROPERTIES */
        this.t = Math.round((-i * 100) / PD.pnum) /* delay in showing up */
        /* velocity along the two axes */
        this.vx = randsgn() * rand(PD.vmax, 0.5 * PD.vmax, PD.prec)
        this.vy = randsgn() * rand(PD.vmax, 0.5 * PD.vmax, PD.prec)
        this.ψ = rand(2, -2, 2) * PD.auni /* rotation speed */

        this.a = PD.nint /* initial polygon alpha */
      }

      get coords() {
        let cv = [] /* array containing coordinates of vertices */

        for (let k = 0; k < this.n; k++) {
          let γ = this.φ + k * this.β /* current vertex angle */

          /* add current vertex coordinates to the array */
          cv.push([
            +(this.ox + this.f * PD.crad * Math.cos(γ)).toFixed(1),
            +(this.oy + this.f * PD.crad * Math.sin(γ)).toFixed(1)
          ])
        }

        return cv
      }

      update() {
        this.t++

        if (
          this.t > 0 /* animation of current poly has started */ &&
          this.a > 0 /* current poly hasn't faded away fully */
        ) {
          if (this.f < 1) this.f = +(this.f + PD.sint).toFixed(PD.prec)
          else if (this.t > 2 * PD.nint) this.a--

          /* decelaration */
          this.vx *= 0.99
          this.vy *= 0.99

          /* update polygon position and rotation */
          this.ox += this.vx * PD.crad
          this.oy += this.vy * PD.crad
          this.φ += this.ψ

          /* ensure they don't go outside the canvas */
          if (Math.abs(this.ox) > -CD.off) this.vx *= -1
          if (Math.abs(this.oy) > -CD.off) this.vy *= -1
        }
      }
    }

    function draw() {
      PA.forEach(p => p.update()) /* update polygon size/ alpha */

      let inview = PA.filter(c => c.t >= 0 && c.a > 0),
        hidden = PA.filter(c => c.t < 0)

      if (inview.length) {
        CD.ctx.fillStyle = '#F6F6F4' /* set white fill for background rect */
        /* fill the whole canvas rectangle with white */
        CD.ctx.fillRect(CD.off, CD.off, CD.dim, CD.dim)

        /* set black fill for masking polygons */
        CD.ctx.fillStyle = '#000'
        CD.ctx.strokeStyle = 'hsla(0, 0%, 100%, .2)'

        /* reduce number of alpha buchets we loop through as much as possible */
        let amax = 1

        /* go through all possible alpha buckets */
        for (let j = 1; j <= PD.amax; j++) {
          let alpha_bucket = PA.filter(c => c.a === j)

          /* if there are any polygons in the current alpha bucket */
          if (alpha_bucket.length) {
            if (j > amax) amax = j

            CD.ctx.globalAlpha = +(PD.sint * j).toFixed(2)
            CD.ctx.beginPath()

            /* go through each of the polygons */
            alpha_bucket.forEach(p => {
              let coords = p.coords /* vertex coords for current poly */

              /* draw polygon edges */
              for (let k = 0; k <= p.n; k++) {
                CD.ctx[`${FN[0 ** k]}To`](...coords[k % p.n])
              }
            })

            /* keep this out of forEach loop for better perf */
            CD.ctx.closePath()
            CD.ctx.fill() /* fill all polygons with the current alpha */
            CD.ctx.stroke()
          }
        }

        PD.amax = amax
        rID = requestAnimationFrame(draw)
      } else if (!hidden.length) {
        reset()
      }
    }

    function reset() {
      if (rID) {
        /* exit animation loop */
        cancelAnimationFrame(rID)
        rID = null
      }

      /* refresh the array of random polygons */
      for (let i = 0; i < PD.pnum; i++) {
        PA[i] = new RandPoly(i)
      }

      PD.amax = PD.nint /* max alpha bucket index */

      let prv = iID /* get previous logo ID */
      /* generate new logo ID different from previous one */
      do {
        iID = rand(NL - 1)
      } while (iID === prv)

      /* change the image and its alt attribute */
      _L.src = LA[iID][1]
      _L.setAttribute('alt', LA[iID][0])
      draw()
    }

    ;(function init() {
      CD.ctx = CD._el.getContext('2d') /* canvas 2D context */
      CD.dim = +CD._el.width /* edge length of canvas square */
      CD.off = -0.5 * CD.dim /* top left corner offset/ coordinate */

      PD.crad = 0.125 * CD.dim /* a polygon's max circumradius */
      PD.derr = 0.5 * PD.crad /* max absolute offset from accurate curve */
      PD.nint = 250 /* number of alpha intervals (buckets) */
      PD.amax = PD.nint /* max alpha bucket index */
      PD.sint = 1 / PD.nint /* size of alpha intervals (buckets) */

      CD.ctx.translate(-CD.off, -CD.off) /* put 0,0 point in the middle */

      reset()
    })()
  }, [])

  return (
    <div className="w-full h-full" id="logo">
      <canvas
        className="relative logo-lyr"
        aria-hidden="true"
        ref={canvasRef}
        height="800"
        width="800"
        id="logo-mask"
        {...props}
      />
      <img
        className="logo-lyr"
        alt="Wrapped Bitcoin"
        src="https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png"
        ref={logoRef}
        id="logo-img"
      />
    </div>
  )
}

export default Background
