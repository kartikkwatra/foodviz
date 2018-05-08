import Typography from 'typography'
import twinPeaksTheme from 'typography-theme-twin-peaks'
twinPeaksTheme.baseFontSize = '16px'
twinPeaksTheme.bodyFontFamily = ['Adamina']
// twinPeaksTheme.headerFontFamily = ['Dosis']
// import lawtonTheme from 'typography-theme-lawton'
// bodyFontFamily: ['Adamina'],
//   headerFontFamily: ['Dosis'],
twinPeaksTheme.scaleRatio = 2
const typography = new Typography({
  baseFontSize: 18,
  bodyFontFamily: ['Lora'],
  headerFonFamily: ['Adamina'],
  baseLineHeight: 1.8,
  scaleRatio: 2.5,
})

export default typography
