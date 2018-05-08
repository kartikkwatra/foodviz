import React, { Component } from 'react'
import totaldata from '../Data/totaldata2.json'
import RadialCustom from '../components/RadialCustom'
import RadialImp from '../components/RadialImp'
import styled from 'react-emotion'
import Img from 'gatsby-image'
// import ReactTooltip from 'react-tooltip'

//styling
const RadialWrapper = styled('div')`
  display: flex;
  justify-content: center;
  // flex-wrap: wrap;
`

const RadialWrapperWide = styled('div')`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const TextWrapper = styled('div')`
  max-width: 690px;
  margin: auto;
  word-spacing: 0.13rem;
`

const ImgWrapper = styled('div')`
  max-width: 960px;
  margin: auto;
`

class IndexPage extends Component {
  dataprep = () => {
    this.top10 = totaldata.filter(d => d.vizcode === 'top10')
    this.nexttop10 = totaldata.filter(d => d.vizcode === 'nexttop10')
    this.bottom10 = totaldata.filter(d => d.vizcode === 'bottom10')
    this.imptop10 = totaldata.filter(d => d.vizcode === 'imptop10')
  }

  render() {
    this.dataprep()
    return (
      <div>
        <TextWrapper>
          <p>
            Azadpur Mandi of Delhi is a wholesale Fruits and Vegetable(F&V)
            market where various F&V arrive in large quantities either directly
            from farmers or through middlemen from different parts of India and
            also imports from several other countries.
          </p>
          <p>
            In terms of arrival quantity, Azadpur Mandi is the largest F&V
            market in Asia. Sopore Mandi of J&K is the second largest fruits
            market in Asia. If you are a resident of Delhi, chances are that any
            fruit you purchase in Delhi is coming from the Azadpur Mandi. The
            Mandi is a vibrant place of bustling activity especially in the wee
            hours, when the produce arrives in trucks from different parts of
            the country. Upon arrival, the produce is auctioned for sale by
            registered agents of the Market. Buyers range from the hospitality
            industry to the pushcart vendors.
          </p>
        </TextWrapper>
        <ImgWrapper>
          <Img sizes={this.props.data.imageOne.sizes} />
          <em style={{ fontSize: '0.8rem' }}>
            Azadpur Mandi in the wee hours. Image Source: Barcroft Images
          </em>
        </ImgWrapper>

        <TextWrapper>
          <br />
          <p>
            The Marketing Committee of Azadpur Mandi publishes daily market
            bulletin on it's website which provides information on the arrival
            quantity of various food items each day along with the places from
            which the food item arrived. Here I visualise the data for the F.Y.
            2016-17 of some fruits of interest.
          </p>
          <p>
            To get a sense of the scale of the market and to find out where do
            the fruits you relish come from, explore the visualisation by
            scolling down.{' '}
          </p>
          <ul>
            <li>
              It is important to note here that the data does not provide
              information on how much of a food item arrived from a specific
              location. It only provides the total arrival quantity of a food
              item for the day and the list of various places it arrived from.
            </li>
          </ul>

          <hr />
          <h2>How to read the visualisation:</h2>
          <div style={{ marginTop: '-1rem' }}>
            <h4>Follow along the numbers 👉 </h4>
          </div>
        </TextWrapper>
        <ImgWrapper>
          <Img sizes={this.props.data.howtopartOnee.sizes} />
        </ImgWrapper>
        <TextWrapper>
          <div style={{ marginTop: '2rem' }}>
            <hr />
          </div>
        </TextWrapper>
        <ImgWrapper>
          <Img sizes={this.props.data.howtopartTwo.sizes} />
        </ImgWrapper>
        <TextWrapper>
          <div style={{ marginTop: '2rem' }}>
            <hr />
          </div>
          <h3>Top 10 Fruits of the year, by domestic arrivals</h3>
        </TextWrapper>
        <RadialWrapper>
          <div style={{ marginTop: '-1rem', marginLeft: '-2rem' }}>
            <RadialCustom
              //Data
              partition_ring_group={this.top10}
              //Encodings
              ring="Food"
              partition="Month"
              arc="Locationlist"
              alignment="No"
              //Design
              width={690}
              height={635}
              bubble_circle_radius={290} //Governs the size of the whole radial proportionally
              min_radius={120}
              arc_height={7}
              bubbleRfactor={120}
              // extra_partitions={1} //Can't be zero now TODO: Remove from props
              bg_ring_gap={0.7}
              bubbleArcGap={70}
              lift={55}
              pull={0}
              containerId="top10"
            />
          </div>
          <div style={{ marginLeft: '2rem', maxWidth: '80' }}>
            <img src={require('../images/stateRegion.png')} />
          </div>
        </RadialWrapper>

        <TextWrapper>
          <h4>Did you know?</h4>
          <ul>
            <li>
              Apple trumps all F&V by being the largest arrival of the year in
              both domestic and international arrivals. A massive 4.7 lakh
              tonnes of Apples came to the Mandi in domestic arrivals in the
              year 2016-17, which is 1 lakh tonnes more than Potato, the second
              heighest domestic arrival in combined F&V category, and 3 lakh
              tonnes more than Mango, the second heighest domestic arrival in
              Fruits category.
            </li>
            <li>
              6,783 Tonnes of Apple arrived on 26th September 2016. This the
              highest arrival quantity of any food on any given day during
              studied year.
            </li>
            <li>
              Mango is by far the most grographically diverse fruit from the
              perspective of domestic arrivals. It arrives from 9 different
              states in the whole year. The other 'geographically diverse'
              foods, in the above context, are Sarda Melon with 8 states &
              Banana,Guava,Water Melon with 7 states.
            </li>
            {/* <li>Variety</li> */}
          </ul>
          <hr />

          <h3>
            The next 10 fruits ranked by domestic arrival quantity for the year
          </h3>
        </TextWrapper>

        <RadialWrapper>
          <div style={{ marginTop: '-4rem', marginLeft: '-5rem' }}>
            <RadialCustom
              // Here you can give some logical grouping to arc i.e States to support decoding by reducing colors
              // Mini India Map on top right to help decode Location
              //Data
              partition_ring_group={this.nexttop10}
              //Encodings
              ring="Food"
              partition="Month"
              arc="Locationlist"
              alignment="No"
              //Design
              width={690}
              height={750}
              bubble_circle_radius={290} //Governs the size of the whole radial proportionally
              min_radius={120}
              arc_height={7}
              bubbleRfactor={20}
              // extra_partitions={1} //Can't be zero now TODO: Remove from props
              bg_ring_gap={0.7}
              bubbleArcGap={70}
              lift={35}
              pull={0}
              containerId="nexttop10"
            />
          </div>
        </RadialWrapper>

        <TextWrapper>
          <h4>Did you find out ?</h4>
          <p>
            As we moved from the top ten to the next ten (abovementioned
            fruits), the set of ten is predominantly sourced from{' '}
            <span style={{ backgroundColor: '#2C8ACC', color: 'white' }}>
              North India
            </span>{' '}
            as is clearly visible from the colors.{' '}
            <span style={{ backgroundColor: '#FF782E', color: 'white' }}>
              West India
            </span>{' '}
            stands a close second. This trend will be even more prominent when
            we look at the 10 bottom most fruits by domestic arrival.
          </p>
          <hr />
          <h3>The 10 bottommost fruits by Domestic arrivals </h3>
        </TextWrapper>
        <RadialWrapper>
          <div style={{ marginTop: '-2rem', marginLeft: '-5rem' }}>
            <RadialCustom
              // Here you can give some logical grouping to arc i.e States to support decoding by reducing colors
              // Mini India Map on top right to help decode Location
              //Data
              partition_ring_group={this.bottom10}
              //Encodings
              ring="Food"
              partition="Month"
              arc="Locationlist"
              alignment="No"
              //Design
              width={690}
              height={670}
              bubble_circle_radius={290} //Governs the size of the whole radial proportionally
              min_radius={120}
              arc_height={7}
              bubbleRfactor={0.5}
              // extra_partitions={1} //Can't be zero now TODO: Remove from props
              bg_ring_gap={0.7}
              bubbleArcGap={70}
              lift={59}
              pull={-10}
              containerId="bottom10"
            />
          </div>
        </RadialWrapper>
        <TextWrapper>
          <h3>Top 10 internationally imported foods in the Mandi</h3>
        </TextWrapper>
        <RadialWrapper>
          <div style={{ marginTop: '-3rem', marginLeft: '-2rem' }}>
            <RadialImp
              // Here you can give some logical grouping to arc i.e States to support decoding by reducing colors
              // Mini India Map on top right to help decode Location
              //Data
              partition_ring_group={this.imptop10}
              //Encodings
              ring="Food"
              partition="Month"
              arc="Countrylist"
              alignment="No"
              //Design
              width={710}
              height={750}
              bubble_circle_radius={290} //Governs the size of the whole radial proportionally
              min_radius={120}
              arc_height={7}
              bubbleRfactor={2000}
              // extra_partitions={1} //Can't be zero now TODO: Remove from props
              bg_ring_gap={0.7}
              bubbleArcGap={70}
              lift={40}
              pull={15}
              containerId="imptop10"
            />
          </div>
          <div style={{ marginLeft: '2rem', maxWidth: '80' }}>
            <img src={require('../images/continents.png')} />
          </div>
        </RadialWrapper>
        <TextWrapper>
          <h4> Pay close attention, </h4>
          <p style={{ marginTop: '-1rem' }}>
            to the pattern of arrivals for Apples in imported category and then
            go back and match it with the arrival pattern for Apples in domestic
            category. What did you find out?{' '}
          </p>
          <hr />
          {/* <h2> Other interesting imported items </h2>
          <p>
            Purple Mangosteen - Link
            <br /> Rambutan - link
          </p> */}
          <h4 style={{ wordSpacing: '0.4rem' }}>
            This Project was made using Selenium Webriver-Python for web
            scraping the data, Openrefine and R for data cleaning, R for data
            wrangling and analysis, D3.Js & React.Js for web development and
            Gravit Designer for Illustrations.
          </h4>
        </TextWrapper>
      </div>
    )
  }
}

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    imageOne: imageSharp(id: { regex: "/azp img1.jpg/" }) {
      sizes(maxWidth: 960) {
        ...GatsbyImageSharpSizes
      }
    }
    howtopartOnee: imageSharp(id: { regex: "/howtopart1.png/" }) {
      sizes(maxWidth: 960) {
        ...GatsbyImageSharpSizes
      }
    }

    howtopartTwo: imageSharp(id: { regex: "/howtopartTwo.png/" }) {
      sizes(maxWidth: 960) {
        ...GatsbyImageSharpSizes
      }
    }
    stateRegion: imageSharp(id: { regex: "/stateRegion.png/" }) {
      sizes(maxWidth: 150) {
        ...GatsbyImageSharpSizes
      }
    }
    headerImage: imageSharp(id: { regex: "/azp img3.jpg/" }) {
      sizes(maxWidth: 1200) {
        ...GatsbyImageSharpSizes
      }
    }
  }
`
