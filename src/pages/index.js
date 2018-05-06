import React, { Component } from 'react'
import mArrivals from '../Data/monthly_arrivals.json'
import month_food_group from '../Data/month_food_grouping.json'
import totaldata from '../Data/totaldata.json'
import RadialCustom from '../components/RadialCustom'
import RadialImp from '../components/RadialImp'
import styled from 'react-emotion'
// import { log } from 'util'
import Img from 'gatsby-image'

//styling
const RadialWrapper = styled('div')`
  display: flex;
  justify-content: center;
`

const RadialWrapperWide = styled('div')`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const TextWrapper = styled('div')`
  max-width: 680px;
  margin: auto;
`

const ImgWrapper = styled('div')`
  max-width: 910px;
  margin: auto;
`

class IndexPage extends Component {
  dataprep = () => {
    // console.log(totaldata)
    // console.log(month_food_group)

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
            market in Asia. The second biggest also happens to be in India:
            Sopore Mandi of J&K. The Mandi is a vibrant place of bustling
            activity especially in the wee hours, when the produce arrives in
            trucks from different parts of the country. Upon arrival, the
            produce is auctioned for sale by registered agents of the Market.
            Buyers range from the hospitality industry to the pushcart vendors.
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
            2016-17 of some food items of interest (mostly fruits).
          </p>
          <p>
            To get a sense of the scale of the market and to find out where do
            the fruits you relish come from, explore the visualisation by
            scolling down.
          </p>
          <p>
            Sabjiyan to jaydatar sabhi jageh ho jati hai, that's why fruits are
            interesting.
          </p>
          <hr />
          <h2>How to read the visualisation </h2>
        </TextWrapper>
        {/* <RadialWrapper>
          <RadialCustom
            // Here you can give some logical grouping to arc i.e States to support decoding by reducing colors
            // Mini India Map on top right to help decode Location
            //Data
            mArrivals={mArrivals}
            partition_ring_group={month_food_group}
            //Encodings
            ring="Food"
            partition="Month"
            arc="Location"
            alignment="No"
            //Design
            width={790}
            height={700}
            bubble_circle_radius={315} //Governs the size of the whole radial proportionally
            min_radius={135}
            arc_height={8}
            bubbleRfactor={110}
            // extra_partitions={1} //Can't be zero now TODO: Remove from props
            bg_ring_gap={1}
            containerId="cmp1"
          />
        </RadialWrapper> */}
        <TextWrapper>
          <hr />
          <h2>Top 10 Fruits of the year, by domestic arrivals</h2>
        </TextWrapper>
        <RadialWrapperWide>
          <div style={{ marginTop: '-1rem' }}>
            <RadialCustom
              // Here you can give some logical grouping to arc i.e States to support decoding by reducing colors
              // Mini India Map on top right to help decode Location
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

          <div style={{ maxWidth: 400, marginTop: '2rem', fontSize: 16 }}>
            <h4>Facts you might not know</h4>
            <p>
              - Apple trumps all F&V by being the largest arrival of the year in
              both domestic and international arrivals. A massive 4.7 lakh
              tonnes of Apples came to the Mandi in domestic arrivals in the
              year 2016-17, which is 1 lakh tonnes more than Potato, the second
              heighest domestic arrival in combined F&V category, and 3 lakh
              tonnes more than Mango, the second heighest domestic arrival in
              Fruits category. All of apple comes from North India except for
              two months where it also arives from MP(Central India).
              <br />
              How many % of fruits come from specific region
              <br />
              Mango is by far the most grographically diverse fruit in domestic
              arrivals.
              <br />
              Most and least diverse food crops in terms of arrivals
              <br /> A typical day example
              <br /> Railway - Dropping the idea
            </p>
          </div>
        </RadialWrapperWide>
        <RadialWrapperWide>
          <div style={{ marginTop: '-1rem' }}>
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

          <div style={{ maxWidth: 400, marginTop: '2rem', fontSize: 16 }}>
            <h4>Facts you might not know</h4>
            <p>
              - Apple trumps all F&V by being the largest arrival of the year in
              both domestic and international arrivals. A massive 4.7 lakh
              tonnes of Apples came to the Mandi in domestic arrivals in the
              year 2016-17, which is 1 lakh tonnes more than Potato, the second
              heighest domestic arrival in combined F&V category, and 3 lakh
              tonnes more than Mango, the second heighest domestic arrival in
              Fruits category. All of apple comes from North India except for
              two months where it also arives from MP(Central India).
              <br />
              How many % of fruits come from specific region
              <br />
              Mango is by far the most grographically diverse fruit in domestic
              arrivals.
              <br />
              Most and least diverse food crops in terms of arrivals
              <br /> A typical day example
              <br /> Railway - Dropping the idea
            </p>
          </div>
        </RadialWrapperWide>
        <RadialWrapperWide>
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
        </RadialWrapperWide>
        <RadialWrapperWide>
          <div style={{ marginTop: '-1rem' }}>
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
        </RadialWrapperWide>

        <h2> Other interesting imported items </h2>
        <p>
          Purple Mangosteen - Link
          <br /> Rambutan - link
        </p>
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
  }
`
