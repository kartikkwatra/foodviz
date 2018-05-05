import Typography from 'typography'
import twinPeaksTheme from 'typography-theme-twin-peaks'
twinPeaksTheme.baseFontSize = '16px'
twinPeaksTheme.bodyFontFamily = ['Adamina']
// twinPeaksTheme.headerFontFamily = ['Dosis']
import lawtonTheme from 'typography-theme-lawton'
// bodyFontFamily: ['Adamina'],
//   headerFontFamily: ['Dosis'],
twinPeaksTheme.scaleRatio = 2
const typography = new Typography({
  baseFontSize: 18.5,
  bodyFontFamily: ['Lato'],
  headerFonFamily: ['Dosis'],
  baseLineHeight: 1.9,
  scaleRatio: 2.5,
})

export default typography
