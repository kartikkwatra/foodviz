import React, { Component } from 'react'
import * as d3 from 'd3'
// import * as dAnn from "d3-svg-annotation";
import _ from 'lodash'
// import chroma from 'chroma-js'
import ReactTooltip from 'react-tooltip'

// const width = 900;
// const height = 900;
const margin = { left: 10, top: 10, right: 10, bottom: 10 }

//controlled growth curve function
// let cgf = (x) => {
//   return Math.abs(x/(70-x));
// }

// let colors2 = ['#2A88B2', '#FF5CBB', '#46FF98', '#9526C9', '#009688', '#C75E52']

let colors = [
  '#66C5CC',
  '#F6CF71',
  '#F89C74',
  '#DCB0F2',
  '#87C55F',
  '#9EB9F3',
  '#FE88B1',
  '#8BE0A4',
  '#B497E7',
  '#D3B484',
]

let colors3 = ['#2C8ACC', '#D41FA9', '#24ED3F', '#FF782E', '#009688', '#E0DD20']

let regionColorScale = d3
  .scaleOrdinal()
  .domain([
    'North India',
    'South India',
    'Central India',
    'West India',
    'Northeast India',
    'East India',
  ])
  .range(colors3)

class RadialCustom extends Component {
  constructor(props) {
    super(props)
    this.partition_ring_group = [...this.props.partition_ring_group]

    this.partition = this.props.partition
    this.ring = this.props.ring
    this.arc = this.props.arc
    this.extra_partitions = this.props.extra_partitions
    this.radius = this.props.bubble_circle_radius

    //FIXME: Assigning the encoding value 'ring' to this.food, so this.food is aware that it is encoded as ring. Using deconstructor syntax
    for (let [key, value] of Object.entries(this.props)) {
      if (value === 'Food') {
        this.food = key
      }
    }

    //Random function for positioning of bubbles
    this.seed = 10
    this.random = () => {
      let x = Math.sin(this.seed++) * 10000
      return x - Math.floor(x)
    } //function random
  }

  componentWillMount = () => {
    // this.simulation
    //   // .alphaDecay(0.023)
    //   .on('tick', this.ticked)
  }

  componentDidMount = () => {
    this.container = d3.select(this.refs[this.props.containerId])
    this.calculateData()
    this.renderBubbleChart()

    this.simulation = d3
      .forceSimulation(this.partition_ring_group)
      .force(
        'center',
        d3.forceCenter(
          this.props.width / 2 - this.props.pull,
          this.props.height / 2 - this.props.lift
        ) // Vertival lift adjustment of the ring
      )
      // .alphaTarget(0.021)
      .force('y', d3.forceY().y(d => d.focusY))
      .force('x', d3.forceX().x(d => d.focusX))
      .force(
        'collide',
        d3.forceCollide(
          d => Math.sqrt(d.Arrival / this.props.bubbleRfactor) + 2
        )
      ) //TODO: Creating a log like scale
      .alphaMin(0.2)
      .velocityDecay(0.65)
      .on('tick', this.ticked)
    this.renderArcChart()
  }

  componentDidUpdate = () => {
    // this.calculateData()
    // this.renderBubbleChart()
    // this.renderArcChart()
  }

  calculateData = () => {
    //PROCESSING DATA
    // this.bubble_circle_radius = this.props.width / 2.5 - margin.left;

    //FIXME: Proper Filtering data flow. Ring filter-er
    //FIXME: Arrival Data not filtered based on rings!

    //FIXME:
    //Removing this temporary filter for 10 values Not removing keyfilter, but only filtering of partition ring gp, since arrival data is also filtered.Later
    //UGLY: Filtering for data without any logic, just based on array index.
    // this.key_filter = []
    // this.partition_ring_group.forEach(d => this.key_filter.push(d[this.ring]))
    // this.key_filter = _.uniqBy(this.key_filter)
    // this.partition_ring_group = this.partition_ring_group.filter(
    //   d => this.key_filter.indexOf(d[this.ring]) < 15
    // )

    //Perfect
    // STATE KEYS for color ATM
    this.stateRegionKeys = {
      'Himachal Pradesh': 'North India',
      Haryana: 'North India',
      'Uttar Pradesh': 'North India',
      Uttarakhand: 'North India',
      'Jammu and Kashmir': 'North India',
      Punjab: 'North India',
      Rajasthan: 'North India',
      Goa: 'West India',
      Gujarat: 'West India',
      Maharashtra: 'West India',
      'Andhra Pradesh': 'South India',
      'Tamil Nadu': 'South India',
      Karnataka: 'South India',
      Telangana: 'South India',
      Kerala: 'South India',
      Bihar: 'East India',
      Jharkhand: 'East India',
      Orissa: 'East India',
      'West Bengal': 'East India',
      Chhattisgarh: 'Central India',
      'Madhya Pradesh': 'Central India',
      'Arunachal Pradesh': 'Northeast India',
      Assam: 'Northeast India',
      Manipur: 'Northeast India',
      Meghalaya: 'Northeast India',
      Mizoram: 'Northeast India',
      Nagaland: 'Northeast India',
      Sikkim: 'Northeast India',
      Tripura: 'Northeast India',
    }

    //Processing partition_ring_group
    let arc_count = [] //for maximum number of arcs possible
    // FIXME: these keys are temporary solutions for things like color and arrangement (maybe others). Fix it soon
    this.arc_key = []
    this.ring_key = []
    this.partition_key = []

    this.regionOrder = [
      'North India',
      'Central India',
      'West India',
      'South India',
      'East India',
      'Northeast India',
    ]

    // Generating arc,ring,partition key, max_arc
    this.partition_ring_group.forEach(d => {
      let parser = d3.utcParse('%m/%Y')
      if (this.arc !== 'Month') d.date = parser(d.Month + '/' + d.Year)

      arc_count.push(d[this.arc].length)
      this.ring_key.push(d[this.ring])

      // Month Name is configured here
      if (this.partition === 'Month') {
        this.formatMonth = d3.timeFormat('%B')
        this.partition_key[d.date.getMonth()] = this.formatMonth(d.date)
      } else {
        this.partition_key.push(d[this.partition]) // Partition key not logically sorted.
      }

      d[this.arc].forEach(d => {
        this.arc_key.push(d)
      })

      d[this.arc] = _.sortBy(d[this.arc])

      d[this.arc] = _.sortBy(d[this.arc], d =>
        this.regionOrder.indexOf(this.stateRegionKeys[d])
      )
    })

    this.arc_key = _.uniqBy(this.arc_key)
    this.ring_key = _.uniqBy(this.ring_key)

    //Sorting the ring_key by yArrival
    this.ring_key = _.orderBy(
      this.ring_key,
      food => {
        let x = this.partition_ring_group.filter(d => d.Food === food)
        return x[0].yArrival
      },
      'desc'
    )

    if (this.partition !== 'Month')
      this.partition_key = _.uniqBy(this.partition_key)

    this.food_key = this[this.food + '_key']
    this.max_arc = d3.max(arc_count)

    //Prepping the data

    // // Filtering arrival data
    // this.ArrivalData = this.ArrivalData.filter(
    //   d => this.key_filter.indexOf(d.FoodEng) < 10
    //
    //REVIEW: Can JS UTC formatted date be added right in the data? No month, no year
    //Adding Date
    // this.ArrivalData.forEach(d => {
    //   let parser = d3.utcParse('%B/%Y')
    //   d.date = parser(d.Month + '/' + d.Year)
    // })

    //Angle calculations
    this.min_radius = this.props.min_radius
    this.max_radius = this.radius - this.props.bubbleArcGap //FIXME: Gap maintain should be based on scale factor
    this.arc_height = this.props.arc_height
    let no_of_partitions = this.partition_key.length //+ this.extra_partitions;
    this.sep_degree = Math.PI / 360
    this.arc_degree
    this.annotation_partition_degree = Math.PI / 3
    let available_degree = Math.PI * 2 - this.annotation_partition_degree
    this.partition_degree = available_degree / no_of_partitions
    this.rotation_degree = this.partition_degree / 2 //TODO: Centering the annotation_partition, hence rotating all   -this.partition_degree / 2;

    //REVIEW: For synching with ArcChart
    // Assigning FocusX and FocusY by grouping by month
    this.partition_ring_group = _.chain(this.partition_ring_group)
      .groupBy(d => d.date.getMonth())
      //.sortBy(d => d.date.getMonth())
      .map(Arrivals => {
        return _.map(Arrivals, arr => {
          let month = arr.date.getMonth()
          // let partitionBased_startAngle =
          // -this.partition_degree / 2 + this.partition_degree * month;
          let angle
          if (month <= 5) {
            angle =
              this.partition_degree * (month + 1) -
              Math.PI / 2 -
              this.rotation_degree
            // 2 * 2 * Math.PI / 360;
          } else if (month > 5) {
            angle =
              this.partition_degree * (month + 1) +
              this.annotation_partition_degree -
              Math.PI / 2 -
              this.rotation_degree +
              -2 * 1 * Math.PI / 360
          }

          // this.partition_degree * month - Math.PI / 2 + this.rotation_degree;
          let focusX = this.radius * Math.cos(angle)
          let focusY = this.radius * Math.sin(angle)
          let x = focusX + this.random()
          let y = focusY + this.random()
          return Object.assign(arr, {
            focusX,
            focusY,
            x,
            y,
          })
        })
      })
      .flatten()
      .value()

    // console.log(this.partition_ring_group)

    this.allStates_in_year = []
    //Creating Unique state list for each Food
    for (let index in this.food_key) {
      let x = this.partition_ring_group.filter(
        d => d.Food === this.food_key[index]
      )

      let tempArray = []
      x.forEach(d => {
        tempArray = tempArray.concat(d.Locationlist)
      })
      this.allStates_in_year.push(_.uniq(tempArray))
    }

    this.allStates_in_year.forEach((loclist, i) => {
      this.allStates_in_year[i] = _.sortBy(loclist, loc =>
        this.regionOrder.indexOf(this.stateRegionKeys[loc])
      )
    })

    // console.log(this.allStates_in_year)

    // DEPRECATED FOOD KEY: GIVES CONTROL OF ORDER OF FOOD
    // Creating Dictionary keys
    // this.food_keys = {

    //   Apple
    //   :21,
    //   'Pears Shandong'
    //   :3,
    //   Mango
    //   :4,
    //   Mosambi
    //   :5,
    //   Grapes
    //   :6,
    //   'Green Coconut'
    //   :7,
    //   Pomegranate
    //   :8,
    //   'Water Melon'
    //   :9,
    //   Kinnow
    //   :10,
    //   Papaya
    //   :11,
    //   Orange
    //   :12,
    //   'Sarda Melon'
    //   :2,
    //   Banana
    //   :14,
    //   Pineapple
    //   :15,
    //   Coconut
    //   :16,
    //   Sapota
    //   :17,
    //   Pumpkin
    //   :18,
    //   Plum
    //   :19,
    //   Guava
    //   :20,
    //   Corn
    //   :12,
    // };
  }

  renderBubbleChart = () => {
    //TODO: is this place alright to append the text glow defs ?
    //Prerequisites:
    var defs = this.container.append('defs')
    function rgbToCMYK(rgb) {
      var r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        k = 1 - Math.max(r, g, b)

      return {
        cyan: (1 - r - k) / (1 - k),
        magenta: (1 - g - k) / (1 - k),
        yellow: (1 - b - k) / (1 - k),
        black: k,
      }
    } //function rgbToCMYK

    //Canvas Part /////////////////////////////////////////
    // var canvas = d3
    //   .select(this.refs["Canvas" + this.props.containerId])
    //   .append("canvas")
    //   .attr("id", "canvas")
    //   .attr("width", 400)
    //   .attr("height", 400);

    // var context = canvas.node().getContext("2d");

    //////////////////////////////////////////////////////////////
    ///////////////////// Create CMYK patterns ///////////////////
    //////////////////////////////////////////////////////////////

    let size_factor = 1.5
    var radius_color_max = 2 * size_factor
    var radius_color = d3.scaleSqrt().range([0, radius_color_max])

    var cmyk_colors = ['yellow', 'magenta', 'cyan', 'black'],
      rotation = [0, -15, 15, 45]

    //Loop over the different colors in the palette
    for (var j = 0; j < colors.length; j++) {
      //Get the radius transformations for this color
      var CMYK = rgbToCMYK(d3.rgb(colors[j]))

      //Create 4 patterns, C-Y-M-K, together forming the color
      defs
        .selectAll('.pattern-sub')
        .data(cmyk_colors)
        .enter()
        .append('pattern')
        .attr('id', function(d) {
          return 'pattern-sub-' + d + '-' + j
        })
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', function(d, i) {
          return 'rotate(' + rotation[i] + ')'
        })
        .attr('width', 2 * radius_color_max)
        .attr('height', 2 * radius_color_max)
        .append('circle')
        .attr('fill', Object)
        .attr('cx', radius_color_max)
        .attr('cy', radius_color_max)
        .attr('r', function(d) {
          return Math.max(0.001, radius_color(CMYK[d]))
        })

      //Nest the CMYK patterns into a larger pattern
      var patterns = defs
        .append('pattern')
        .attr('id', 'pattern-total-' + j)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', radius_color_max * 31)
        .attr('height', radius_color_max * 31)

      //Append white background
      patterns
        .append('rect')
        .attr('width', 900)
        .attr('height', 900)
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'white')

      //Add the CMYK patterns
      patterns
        .selectAll('.dots')
        .data(cmyk_colors)
        .enter()
        .append('rect')
        .attr('class', 'dots')
        .attr('width', 900)
        .attr('height', 900)
        .attr('x', 0)
        .attr('y', 0)
        .attr('mix-blend-mode', 'multiply')
        .attr('fill', function(d, i) {
          return 'url(#pattern-sub-' + cmyk_colors[i] + '-' + j + ')'
        })
    } //for j

    // Canvas part ends here ////////////////////////////
    this.circles = this.container
      .append('g')
      .attr('class', 'bubble_group')
      .selectAll('circle')
      .data(this.partition_ring_group)

    //exit
    this.circles.exit().remove()

    //enter+update
    this.circles = this.circles
      .enter()
      .append('circle')
      .attr('class', d => 'class' + this.food_key.indexOf(d.Food) + 'bubble')
      .merge(this.circles)
      .attr('r', d => Math.sqrt(d.Arrival / this.props.bubbleRfactor))
      .attr('fill', (d, i) => {
        return 'url(#pattern-total-' + this.food_key.indexOf(d.Food) + ')'
      }) //d => colorScale(this.food_key.indexOf(d.FoodEng) / 10))
      .attr('stroke', d => colors[this.food_key.indexOf(d.Food)])
      .attr('stroke-width', 2.5)
      .attr('stroke-opacity', 0.6)
      .attr('fill-opacity', 0.5)
  }

  renderArcChart = () => {
    //TODO: I don't think there is need for alignment based on region, rather sorting
    this.props.alignment === 'Yes'
      ? (this.arc_degree = this.partition_degree / this.arc_key.length)
      : (this.arc_degree = this.partition_degree / this.max_arc)
    //for alignment devide by arc_key.length instead of max_arc

    let ringScale = d3
      .scaleLinear()
      .domain([0, this.ring_key.length])
      .range([this.min_radius, this.max_radius])

    // Arc Setup
    let minor_arcGen = d3
      .arc()
      .outerRadius((d, i, j) => {
        let ring = j[0].parentNode.__data__[this.ring]
        return ringScale(this.ring_key.indexOf(ring))
      })
      .innerRadius((d, i, j) => {
        let ring = j[0].parentNode.__data__[this.ring]
        return ringScale(this.ring_key.indexOf(ring)) - this.arc_height
      })
      .startAngle((d, i, j) => {
        let partition_no // If partition is Month, then it accesses date, else not
        this.partition === 'Month'
          ? (partition_no = j[0].parentNode.__data__.date.getMonth())
          : (partition_no = this.partition_key.indexOf(
              j[0].parentNode.__data__[this.partition]
              // FIXME: Non-Month Partitions being arranged based on partition_key
            ))

        let partitionBased_startAngle =
          -this.partition_degree / 2 + this.partition_degree * partition_no

        if (partition_no >= 6) {
          partitionBased_startAngle += this.annotation_partition_degree
        }

        if (this.props.alignment === 'Yes') {
          let arcBased_startAngle = this.arc_key.indexOf(d) * this.arc_degree
          let s_angle =
            partitionBased_startAngle +
            arcBased_startAngle +
            this.rotation_degree
          return i === 0 ? this.sep_degree + s_angle : s_angle
        } else if (this.props.alignment === 'No') {
          let arcBased_startAngle = i * this.arc_degree
          let s_angle =
            partitionBased_startAngle +
            arcBased_startAngle +
            this.rotation_degree
          return i === 0 ? this.sep_degree + s_angle : s_angle
        }
      })
      .endAngle((d, i, j) => {
        let partition_no
        this.partition === 'Month'
          ? (partition_no = j[0].parentNode.__data__.date.getMonth())
          : (partition_no = this.partition_key.indexOf(
              j[0].parentNode.__data__[this.partition]
            ))
        let partitionBased_startAngle =
          -this.partition_degree / 2 + this.partition_degree * partition_no

        if (partition_no >= 6) {
          partitionBased_startAngle += this.annotation_partition_degree
        }

        if (this.props.alignment === 'Yes') {
          let arcBased_startAngle = this.arc_key.indexOf(d) * this.arc_degree
          let s_angle =
            partitionBased_startAngle +
            arcBased_startAngle +
            this.rotation_degree
          return s_angle + this.arc_degree
        } else if (this.props.alignment === 'No') {
          let arcBased_startAngle = i * this.arc_degree
          let s_angle =
            partitionBased_startAngle +
            arcBased_startAngle +
            this.rotation_degree
          return s_angle + this.arc_degree
        }
      })

    //FIXME: Done for now. Creating the 13 parts background rings. Data will be ring_keys
    let bg_ringGen = d3
      .arc()
      .outerRadius((d, i, j) => {
        // let sector_no = j[0].parentNode.__data__ ;
        return ringScale(i) //+ this.props.bg_ring_gap
      })
      .innerRadius((d, i, j) => {
        // let ring = j[0].parentNode.__data__[this.ring];
        return ringScale(i) - this.arc_height //- this.props.bg_ring_gap
      })
      .startAngle((d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        let s_angle =
          -this.partition_degree / 2 +
          this.partition_degree * partition_no +
          this.rotation_degree

        if (partition_no >= 7) {
          s_angle += this.annotation_partition_degree - this.partition_degree
        }

        return this.sep_degree + s_angle
      })
      .endAngle((d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        let s_angle =
          -this.partition_degree / 2 +
          this.partition_degree * partition_no +
          this.rotation_degree
        // pehle end angle shift hoga, fir start angle shift hoga (7 onwards), you are drwaing with one pen,one hand at a time, not two lines simultaneously.
        let end_angle = s_angle + this.partition_degree //Partition no 6 is annotation_partition
        if (partition_no === 6) {
          end_angle = s_angle + this.annotation_partition_degree
        } else if (partition_no > 6) {
          end_angle += this.annotation_partition_degree - this.partition_degree
        }

        return end_angle
      })

    let bg_ringHoverGen = d3
      .arc()
      .outerRadius((d, i, j) => {
        // let sector_no = j[0].parentNode.__data__ ;
        return ringScale(i) //+ this.props.bg_ring_gap
      })
      .innerRadius((d, i, j) => {
        // let ring = j[0].parentNode.__data__[this.ring];
        return ringScale(i) - this.arc_height - this.props.bg_ring_gap - 2.5 //FIXME: Does ringscale have any effect on the order of food names?
      })
      .startAngle((d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        let s_angle =
          -this.partition_degree / 2 +
          this.partition_degree * partition_no +
          this.rotation_degree

        if (partition_no >= 7) {
          s_angle += this.annotation_partition_degree - this.partition_degree
        }

        return this.sep_degree + s_angle
      })
      .endAngle((d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        let s_angle =
          -this.partition_degree / 2 +
          this.partition_degree * partition_no +
          this.rotation_degree
        // pehle end angle shift hoga, fir start angle shift hoga (7 onwards), you are drwaing with one pen,one hand at a time, not two lines simultaneously.
        let end_angle = s_angle + this.partition_degree //Partition no 6 is annotation_partition
        if (partition_no === 6) {
          end_angle = s_angle + this.annotation_partition_degree
        } else if (partition_no > 6) {
          end_angle += this.annotation_partition_degree - this.partition_degree
        }

        return end_angle
      })

    let arcManipulator = (selection, reverseFlag = 1) => {
      // Docstring:
      // Arg: D3 Selection of path element to be manipulated
      // Returns the reversed newArc
      // /Docstring

      //Search pattern for everything between the start and the first capital L
      let firstArcSection = /(^.+?)L/

      //Grab everything up to the first Line statement //Changed select(this) to j[i]
      let newArc = firstArcSection.exec(selection.attr('d'))[1]

      //Replace all the commas so that IE can handle it
      newArc = newArc.replace(/,/g, ' ')

      if (reverseFlag) {
        //If the angle lies beyond a quarter of a circle (90 degrees or pi/2)
        //flip the end and start position

        //Everything between the capital M and first capital A
        let startLoc = /M(.*?)A/
        //Everything between the capital A and 0 0 1
        let middleLoc = /A(.*?)0 0 1/
        //Everything between the 0 0 1 and the end of the string (denoted by $)
        let endLoc = /0 0 1 (.*?)$/
        //Flip the direction of the arc by switching the start and end point
        //and using a 0 (instead of 1) sweep flag
        let newStart = endLoc.exec(newArc)[1]
        let newEnd = startLoc.exec(newArc)[1]
        let middleSec = middleLoc.exec(newArc)[1]

        //Build up the new arc notation, set the sweep-flag to 0
        newArc = 'M' + newStart + 'A' + middleSec + '0 0 0 ' + newEnd
      }

      return newArc
    }

    // #### Creating the Arcs ####
    let arcChartContainer = this.container.append('svg')

    // 13 parts Background Rings
    this.lastringid = this.ring_key.length - 1
    let bg_ring = arcChartContainer
      .selectAll('g')
      .data(d3.range(13))
      .enter()
      .append('g')
      .attr('class', 'rings')
      .attr('id', d => 'partition' + d)

    //Appending Visible path for bg rings
    bg_ring
      .selectAll('path.visible_bg_Arc')
      .data(this.ring_key)
      .enter()
      .append('path')
      .attr('class', 'visible_bg_Arc')
      .attr('id', (d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        return 'partition' + partition_no + 'ring' + i
      })
      .attr(
        'transform',
        'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')'
      )
      .attr('d', bg_ringGen)
      .attr('fill', 'none')
      .attr('fill-opacity', 0.07)
    // .attr("stroke", "grey")
    // .attr("stroke-width", 0.15);

    // Creating Hidden arcs for Partition Annotations (last rings of each partition)
    bg_ring.each((d, i, j) => {
      let selector = 'path#partition' + d + 'ring' + this.lastringid
      let selection_of_pathElem = this.container.select(selector)
      let newArc
      if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) {
        newArc = arcManipulator(selection_of_pathElem, 1)
      } else {
        newArc = arcManipulator(selection_of_pathElem, 0)
      }
      //Appending hidden arc
      // let selector = "g#partition" + i;
      d3
        .select(j[i])
        .append('path')
        .attr('class', 'hiddenArcs')
        .attr('id', (d, i, j) => {
          // let partition_no = j[0].parentNode.__data__;
          return (
            this.props.containerId +
            'HiddenPartition' +
            d +
            'ring' +
            this.lastringid
          )
        })
        .attr(
          'transform',
          'translate(' +
            this.props.width / 2 +
            ',' +
            this.props.height / 2 +
            ')'
        )
        .attr('d', newArc)
        .attr('fill', 'none')
    })

    // Creating Partition Annotations
    this.container
      .selectAll('g.rings')
      .append('text')
      .attr('pointer-events', 'none')
      .attr('class', 'partition_annotations')
      .attr('dy', d => {
        // Code for adjusting the dy for the reversed arcs (partition 5 & 7)
        if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return this.arc_height + 7
        else return -5
      })
      .each((d, i, j) => {
        //Adding Month Names
        d3
          .select(j[i])
          .append('textPath')
          .attr('startOffset', d => {
            if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return '100%'
            else return '0%'
          })
          .attr('text-anchor', d => {
            if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return 'end'
            else return 'start'
          })
          .attr(
            'xlink:href',
            '#' +
              this.props.containerId +
              'HiddenPartition' +
              d +
              'ring' +
              this.lastringid
          )
          .attr('font-size', '0.82rem')
          .attr('fill', '#006064')
          .text(d => {
            // Code for Jumping the annotation partition i.e the partition with Food Names in rings
            if (d === 6) return null
            else if (d > 6) return this.partition_key[d - 1]
            else return this.partition_key[d]
          })
      })

    //Appending hidden arcs for Annot Partition (partition 6)
    this.container
      .select('g#partition6') //TODO: Change 6 incase you change orientation
      .selectAll('path.visible_bg_Arc')
      .attr('fill-opacity', 0.3)
      .attr('fill', (d, i) => 'url(#pattern-total-' + i + ')')
      // .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)
      .attr('stroke', '#006064') //(d, i) => colors[i])
      .each((d, i, j) => {
        let newArc = arcManipulator(d3.select(j[i]))

        //Create a new invisible arc so that the text can flow along
        this.container
          .select('g#partition6')
          .append('path')
          .attr('class', 'hiddenArcs') // TODO: Change the naming here: More specific
          .attr('id', this.props.containerId + 'hiddenArc' + i)
          .attr(
            'transform',
            'translate(' +
              this.props.width / 2 +
              ',' +
              this.props.height / 2 +
              ')'
          )
          .attr('d', newArc)
          .attr('fill', 'none')
      })

    //Appending the hover partition
    this.container
      .select('g#partition6') //TODO: Change 6 incase you change orientation
      .selectAll('path.hover_bg_Arc')
      .data(this.ring_key)
      .enter()
      .append('path')
      .attr('class', 'hover_bg_Arc')
      .attr('id', (d, i, j) => {
        let partition_no = j[0].parentNode.__data__
        return 'hoverArcpartition' + partition_no + 'ring' + i
      })
      .attr(
        'transform',
        'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')'
      )
      .attr('d', bg_ringHoverGen)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.0001)
      .on('mouseover', (d, i, j) => {
        //Listen to mouseover on Annot Partition bg_rings //TODO: Organise
        d3.event.stopPropagation()

        //Clearing arrivalQtyText annotations  //FIXME: Wrong. Should be in mouseout: All reverts to prev stage
        d3.selectAll('text.arrivalQtyText').remove()

        //highlighting the minor arcs
        this.container
          .selectAll('path.minor_arcs')
          // .transition()
          // .duration(150)
          .attr('fill-opacity', (dx, ix, jx) => {
            let ringId = this.ring_key.indexOf(jx[ix].parentNode.__data__.Food)

            return ringId === i ? 1 : 0.07
          })
          .attr('stroke-opacity', (dx, ix, jx) => {
            let ringId = this.ring_key.indexOf(jx[ix].parentNode.__data__.Food)
            return ringId === i ? 1 : 0.1
          })
          .attr('stroke', (dx, ix, jx) => {
            let ringId = this.ring_key.indexOf(jx[ix].parentNode.__data__.Food)
            return ringId === i ? 'white' : 'none'
          })

        this.container //Highlighting the Annot Partition Ring being hovered
          .select('g#partition6') //TODO: Change 6 incase you change orientation
          .selectAll('path.visible_bg_Arc')
          // .transition()
          // .duration(150)
          .attr('fill', (dy, iy) => {
            return 'url(#pattern-total-' + iy + ')'
          })
          .attr('fill-opacity', (dy, iy, jy) => {
            return iy === i ? 0.4 : 0
          })
          .attr('stroke-opacity', (dy, iy, jy) => {
            return iy === i ? 0.5 : 0
          })

        // Creating the dhashed bubble container here:
        this.dashedBubbleContainer = this.container
          .append('g')
          .attr('class', 'dashedBubbleAnnotation')

        //Highlighting the bubbles
        this.container
          .select('g.bubble_group')
          .selectAll('circle')
          .each((dx, ix, jx) => {
            if (dx.Food === d) {
              d3
                .select(jx[ix])
                .transition()
                .duration(150)
                .attr('fill-opacity', 1)
                .attr('stroke-opacity', 1)

              this.create_Radial_Gutter_Annotations(dx)

              if (Math.sqrt(dx.Arrival / this.props.bubbleRfactor) <= 5)
                this.dashed_bubble_annotation(dx)
            } else {
              d3
                .select(jx[ix])
                .transition()
                .duration(100)
                .attr('fill-opacity', 0.075)
                .attr('stroke-opacity', 0.12)
            }
          })

        // //Creating the circular gutter
        // this.container
        //   .append("g")
        //   .attr("class", "radialGutter")
        //   .append("path")
        //   .attr(
        //     "transform",
        //     "translate(" +
        //       this.props.width / 2 +
        //       "," +
        //       this.props.height / 2 +
        //       ")"
        //   )
        //   .attr(
        //     "d",
        //     d3
        //       .arc()
        //       .innerRadius(this.max_radius + 10)
        //       .outerRadius(this.max_radius + 29)
        //       .startAngle(-6 * this.partition_degree)
        //       .endAngle(6 * this.partition_degree)
        //   )
        //   .transition()
        //   .duration(150)
        //   .attr("fill", "none")
        //   .attr("stroke", "hotpink")
        //   .attr("stroke-width", 1.5)
        //   .attr("stroke-opacity", 0.2);

        //Centre of the circle annotation
        //First clearing the previous one FIXME: Wrong: should be in mouseout
        // d3.select('g.centralAnnotation').remove()

        let centralAnnotationContainer = this.container
          .append('g')
          .attr('class', 'centralAnnotation')

        centralAnnotationContainer
          .append('text')
          .attr('fill', '#006064')
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .attr(
            'transform',

            'translate(' +
              this.props.width / 2 +
              ',' +
              (this.props.height / 2 - 40) +
              ')'
          )
          .text(d)

        centralAnnotationContainer
          .append('text')
          .attr('fill', '#006064')
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .attr(
            'transform',

            'translate(' +
              this.props.width / 2 +
              ',' +
              (this.props.height / 2 - 20) +
              ')'
          )
          .text('States')

        centralAnnotationContainer
          .selectAll('rect.centralAnnotation')
          .data(this.allStates_in_year[i])
          .enter()
          .append('rect')
          // .attr("class", "centralAnnotation")
          .attr('transform', (dx, ix) => {
            return (
              'translate(' +
              this.props.width / 2 +
              ',' +
              (this.props.height / 2 - 15 + (ix + 1) * 13) +
              ')'
            )
          })
          .attr('x', dx => -dx.length / (2.5 * 2) + 'em')
          .attr('y', -10)
          .attr('width', dx => dx.length / 2.5 + 'em') //FIXME: set issue:
          .attr('height', '0.62em')
          .attr('fill', dx => regionColorScale(this.stateRegionKeys[dx]))
          .attr('fill-opacity', 0.75)

        centralAnnotationContainer
          .selectAll('text.centralAnnotation')
          .data(this.allStates_in_year[i])
          .enter()
          .append('text')
          .attr('pointer-events', 'none')
          .attr('fill', dx => {
            if (this.stateRegionKeys[dx] === 'East India') return '#2C8ACC'
            else if (this.stateRegionKeys[dx] === 'Central India')
              return '#D41FA9'
            else return 'white'
          })
          // .attr('font-weight','bold' )
          .attr('text-anchor', 'middle')
          .attr('font-size', '0.58rem') //FIXME: Make it legible. what stroke color?
          .attr('transform', (dx, ix) => {
            return (
              'translate(' +
              this.props.width / 2 +
              ',' +
              (this.props.height / 2 - 15 + (ix + 1) * 13) +
              ')'
            )
          })
          .text(dx => dx)
      })
      .on('mouseout', (d, i, j) => {
        //Listen to mouseover on Annot Partition bg_rings //TODO: Organise
        d3.event.stopPropagation()

        //Clearing arrivalQtyText annotations  //FIXME: Wrong. Should be in mouseout: All reverts to prev stage
        d3.selectAll('text.arrivalQtyText').remove()

        // Removing dashedBubbleAnnotation
        this.container.select('g.dashedBubbleAnnotation').remove()

        //highlighting the minor arcs
        this.container
          .selectAll('path.minor_arcs')
          // .transition()
          // .delay(100)
          .attr('fill-opacity', 0.7)
          .attr('stroke-opacity', 0.9)
          .attr('stroke', 'white')

        this.container //Highlighting the Annot Partition Ring being hovered
          .select('g#partition6') //TODO: Change 6 incase you change orientation
          .selectAll('path.visible_bg_Arc')
          // .transition()
          // .duration(150)
          // .attr('fill', (dy, iy) => {
          //   return 'url(#pattern-total-' + iy + ')'
          // })
          .attr('fill-opacity', 0.3)
          .attr('stroke-opacity', 0.3)

        //Highlighting the bubbles
        this.container
          .select('g.bubble_group')
          .selectAll('circle')
          .transition()
          .duration(150)
          .attr('fill-opacity', 0.6)
          .attr('stroke-opacity', 0.7)

        // Remove Gutter annotations
        this.container.selectAll('.arrivalQtyText').remove()

        //Centre of the circle annotation
        //clearing the previous one
        this.container.select('g.centralAnnotation').remove()
      })

    //Adding Food Names in rings (annot partition rings)
    let annot_partition_annotations = arcChartContainer
      .append('svg')
      .attr('class', 'annot_partition_Annotations_container')
      .selectAll('text.ring_annot')
      .data(this.ring_key)
      .enter()
      .append('text')
      .attr('pointer-events', 'none')
      .attr('class', 'ring_annot')
      .attr('fill', '#006064')
      // .attr('stroke-width', 1)
      .attr('x', 1)
      .attr('dy', -1)
      .attr('font-weight', 'bolder')
      .attr('font-size', this.arc_height + this.props.bg_ring_gap + 2.2) //FIXME: Use rem ?
      .append('textPath')
      .attr('startOffset', '50%')
      .attr('text-anchor', 'middle')
      .attr('xlink:href', (d, i) => {
        // let partition_no = j[0].parentNode.__data__;
        return '#' + this.props.containerId + 'hiddenArc' + i
      })
      .text(d => d)

    //FIXME: Why attach tooltip to <body> ?
    let div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .attr('opacity', 0)

    // Adding groups and Data for arcs (this.arc)
    let minor_arcContainer = arcChartContainer
      .selectAll('g.arcsContainer')
      .data(this.partition_ring_group)
      .enter()
      .append('g')
      .attr('class', 'arcsContainer')

    // Appending Minor Arcs
    minor_arcContainer
      .selectAll('path.minor_arcs')
      .data(d => d[this.arc])
      .enter()
      .append('path')
      .attr('class', (d, i, j) => {
        //FIXME:
        let ringId = this.ring_key.indexOf(j[0].parentNode.__data__.Food) //REVIEW: J[0] makes an issue?j[i]
        return 'minor_arcs ring' + ringId
      })
      .attr(
        'transform',
        'translate(' + this.props.width / 2 + ',' + this.props.height / 2 + ')'
      )
      .attr('d', minor_arcGen) // WHY IS TRANSITION DURATION NOT WORKING?
      .attr('fill-opacity', 0.7)
      .attr('stroke-opacity', 0.9)
      .attr('fill', (d, i, j) => {
        //let loc = j[0].parentNode.__data__.Location;
        return regionColorScale(this.stateRegionKeys[d])
      })
      //REVIEW: STROKE DESIGN CHOICES
      .attr(
        'stroke',
        d => 'white' // colorScale(this.arc_key.indexOf(d) / this.arc_key.length)
      )
      .attr('stroke-width', this.arc_height / 25)
      .attr('data-tip', (d, i, j) => {
        return j[0].parentNode.__data__[this.ring] + '<br>' + d
      })
  }

  dashed_bubble_annotation = d => {
    this.dashedBubbleContainer
      .append('circle')
      // .transition()
      // .duration(150)
      .attr('cx', d.x)
      .attr('cy', d.y)
      .attr('r', 20)
      .style('fill', 'none')
      // .style('stroke-opacity', 1)
      .style('stroke-dasharray', 8)
      .style('stroke-width', 2)
      .transition()
      .duration(150)
      .style('stroke', 'grey')
  }

  create_Radial_Gutter_Annotations = dx => {
    //Adding Arrival Qty Text
    // Have to jump the partition 6 here in selector itself
    const partition_no = this.partition_key.indexOf(this.formatMonth(dx.date))
    let selector
    if (partition_no >= 6) {
      selector = 'g#partition' + (partition_no + 1)
    } else {
      selector = 'g#partition' + partition_no
    }

    this.container
      .select(selector)
      .append('text')
      .attr('pointer-events', 'none')
      .attr('class', 'arrivalQtyText')
      .attr('font-size', '0.6rem')
      .attr('dy', d => {
        // Code for adjusting the dy for the reversed arcs (partition 4,5,7,8)
        if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return this.arc_height + 20
        else return -20
      })
      .each((d, i, j) => {
        //Adding Month Names
        d3
          .select(j[i])
          .append('textPath')
          .attr('startOffset', d => {
            if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return '100%'
            else return '0%'
          })
          .attr('text-anchor', d => {
            if (d in { 5: 0, 4: 0, 8: 0, 7: 0 }) return 'end'
            else return 'start'
          })
          .attr('fill', () => colors[this.food_key.indexOf(dx.Food)])
          .attr('stroke', 'black') //() => colors[this.food_key.indexOf(dx.FoodEng)])
          .attr('stroke-width', 0.25)
          .transition()
          .delay(10)
          .attr(
            'xlink:href',
            '#' +
              this.props.containerId +
              'HiddenPartition' +
              d +
              'ring' +
              this.lastringid
          )
          .text(d => {
            if (dx.Arrival / 1000 < 1) {
              if (dx.Arrival < 1) return dx.Arrival.toFixed(2) + ' Tonne'
              else return dx.Arrival.toFixed(0) + ' Tonne'
            } else return Math.round(dx.Arrival / 1000) + 'k Tonne'
          })
      })
  }

  ticked = () => {
    this.circles.attr('cx', d => d.x).attr('cy', d => d.y)
  }

  render() {
    return (
      <div>
        <ReactTooltip
          place="top"
          border={false}
          html={true}
          effect="solid"
          type="info"
        />
        <svg
          width={this.props.width}
          height={this.props.height}
          ref={this.props.containerId}
        />
      </div>
    )
  }
}

export default RadialCustom
