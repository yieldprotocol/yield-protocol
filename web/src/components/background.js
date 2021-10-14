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
        prec: 3 /* decimal precision */,
        enum: 25 /* total numbers of polygons per edge */
      } /* general polygon data */,
      PA = Array(PD.num) /* array of masking polygons we draw */,
      LA = Object.entries({
        'Wrapped Bitcoin': 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
        Ethereum: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        Dai: '/img/dai.png',
        'USD Coin': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=013',
        Yield: '/img/yield.png'
      }) /* array of logos */,
      NL = LA.length /* number of logos */,
      _L = document.getElementById('logo-img') /* logo image element */,
      TFN = {
        linear: function(k) {
          return k
        },
        'ease-in': function(k, e = 1.675) {
          return Math.pow(k, e)
        },
        'ease-out': function(k, e = 1.675) {
          return 1 - Math.pow(1 - k, e)
        },
        'ease-in-out': function(k) {
          return 0.5 * (Math.sin((k - 0.5) * Math.PI) + 1)
        },
        'bounce-ini': function(k, s = -Math.PI / 3) {
          return 1 - Math.sin((1 - k) * s) / Math.sin(s)
        },
        'bounce-fin': function(k, e = Math.PI / 3) {
          return Math.sin(k * e) / Math.sin(e)
        },
        'bounce-ini-fin': function(k, s = -Math.PI / 3, e = Math.PI / 3) {
          return (Math.sin(k * (e - s) + s) - Math.sin(s)) / (Math.sin(e) - Math.sin(s))
        }
      } /* timing functions used for moving polygons */,
      KYS = Object.keys(TFN) /* array of timing function names */,
      NKY = KYS.length,
      DFN = ['line', 'move'] /* drawing functions */

    let rID, iID, io

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
      constructor(k) {
        /* SHAPE PROPERTIES */
        this.n = rand(8, 3) /* number of vertices */
        this.β = (2 * Math.PI) / this.n /* base angle corresp to an edge */
        this.cr = PD.cell / Math.sqrt(2) / Math.cos(0.5 * this.β) /* max polygon circumradius */
        this.f = 0 /* polygon scaling factor */

        /* POSITION PROPERTIES */
        /* initial x,y position of polygon circumcentre */
        this.ix = 0.5 * rand(CD.off, -CD.off)
        this.iy = 0.5 * rand(CD.off, -CD.off)
        let i = ~~(k / PD.enum),
          j = k % PD.enum
        /* final x,y position of polygon circumcentre */
        this.fx = (j + 0.5) * PD.cell + CD.off
        this.fy = (i + 0.5) * PD.cell + CD.off
        /* current x,y position of polygon circumcentre */
        this.ox = this.ix
        this.oy = this.iy
        this.φ = Math.random() * 2 * Math.PI /* initial polygon rotation */

        /* MOTION PROPERTIES */
        this.t = rand(0, -PD.sint) /* delay in showing up */
        this.ψ = rand(2, -2, 2) * PD.auni /* rotation speed */
        this.tfn = KYS[rand(NKY - 1)] /* name of timing function used */

        this.a = PD.aint /* initial polygon alpha */
      }

      get coords() {
        let cv = [] /* array containing coordinates of vertices */

        for (let k = 0; k < this.n; k++) {
          let γ = this.φ + k * this.β /* current vertex angle */

          /* add current vertex coordinates to the array */
          cv.push([
            +(this.ox + this.f * this.cr * Math.cos(γ)).toFixed(1),
            +(this.oy + this.f * this.cr * Math.sin(γ)).toFixed(1)
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
          if (this.f < 1) {
            /* update polygon position */
            let k = +TFN[this.tfn](this.t / PD.sint).toFixed(PD.prec),
              ck = 1 - k
            this.ox = k * this.fx + ck * this.ix
            this.oy = k * this.fy + ck * this.iy

            this.f = +(this.f + 1 / PD.sint).toFixed(PD.prec)
          } else {
            if (this.ox !== this.fx) {
              this.ox = this.fx
              this.oy = this.fy
            }
            if (this.t > 2 * PD.sint + 2 * PD.aint) this.a--
          }

          /* update polygon rotation */
          this.φ += this.ψ
        }
      }
    }

    function draw() {
      PA.forEach(p => p.update()) /* update polygon size/ alpha */

      let inview = PA.filter(c => c.t >= 0 && c.a > 0),
        hidden = PA.filter(c => c.t < 0)

      /* if there are still any polygons that haven't fully faded away */
      if (inview.length) {
        CD.ctx.fillStyle = '#fff' /* set white fill for background rect */
        /* fill the whole canvas rectangle with white */
        CD.ctx.fillRect(CD.off, CD.off, CD.dim, CD.dim)

        CD.ctx.strokeStyle = 'hsla(0, 0%, 100%, .1)'

        /* reduce number of alpha buchets we loop through as much as possible */
        let amax = 1

        /* go through all possible alpha buckets */
        for (let j = 1; j <= PD.amax; j++) {
          let alpha_bucket = PA.filter(c => c.a === j)

          /* if there are any polygons in the current alpha bucket */
          if (alpha_bucket.length) {
            if (j > amax) amax = j

            /* set semitransparent black fill for masking polygons */
            CD.ctx.fillStyle = `hsla(0, 0%, 0%, ${+(j / PD.aint).toFixed(2)})`
            CD.ctx.beginPath()

            /* go through each of the polygons */
            alpha_bucket.forEach(p => {
              let coords = p.coords /* vertex coords for current poly */

              /* draw polygon edges */
              for (let k = 0; k <= p.n; k++) CD.ctx[`${DFN[0 ** k]}To`](...coords[k % p.n])
            })

            /* keep this out of forEach loop for better perf */
            CD.ctx.closePath()
            CD.ctx.fill() /* fill all polygons in the current alpha bucket */
            CD.ctx.stroke() /* stroke all polygons in this bucket */
          }
        }

        /* update max alpha to be found among all polygons, 
			so we reduce the number of alpha buckets we loop through if possible */
        PD.amax = amax
        rID = requestAnimationFrame(draw) /* move to next animation iteration */
      } else if (!hidden.length) {
      /* otherwise, if all polygons have faded away, start a new cycle */
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
      for (let k = 0; k < PD.pnum; k++) PA[k] = new RandPoly(k)

      PD.amax = PD.aint /* max alpha bucket index */

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

      PD.pnum = Math.pow(PD.enum, 2) /* total number of polygons drawn */
      PD.cell = CD.dim / PD.enum /* cell size */
      PD.sint = 150 /* number of motion/ scaling intervals */
      PD.aint = 64 /* number of alpha intervals (buckets) */
      PD.amax = PD.aint /* max alpha bucket index */

      CD.ctx.translate(-CD.off, -CD.off) /* put 0,0 point in the middle */
      CD.ctx.rotate(0.125 * Math.PI)
      CD.ctx.scale(Math.sqrt(2), Math.sqrt(2))

      io = new IntersectionObserver(function(e) {
        /* if the target is out of view, pause the animation */
        if (e[0].intersectionRatio <= 0) {
          if (rID) cancelAnimationFrame(rID)
        } else {
        /* otherwise, start/ resume it */
          rID ? draw() : reset()
        }
      })

      /* start observing */
      io.observe(CD._el)
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
