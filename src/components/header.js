import React from 'react'
import Link from 'gatsby-link'

const Header = ({ siteTitle, subTitle }) => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
      minHeight: 200,
    }}
  >
    <div
      style={{
        margin: '0 auto',

        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1
        style={{
          margin: 'auto',
          textAlign: 'center',
          color: 'white',
          // fontSize:
        }}
      >
        Where does my food come from?
      </h1>

      <h3
        style={{
          margin: 'auto',
          textAlign: 'center',
          color: 'white',
        }}
      >
        Visualising Data from Asia's Largest <br /> Fruits & Vegetable Market
      </h3>
    </div>
  </div>
)

export default Header
