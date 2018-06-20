import Style from 'ol/style/style'
import Stroke from 'ol/style/stroke'
import Fill from 'ol/style/fill'

export default {
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
}
