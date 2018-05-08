import React from 'react'
import Link from 'gatsby-link'

const Header = ({ headerImage }) => (
  <div
    style={{
      background: `linear-gradient(-45deg, #262c41 0%, #46507a  100%)`,
      marginBottom: '1.45rem',
      minHeight: 250,
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
