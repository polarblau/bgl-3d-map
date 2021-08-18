import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import styles from './Map.module.css'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiZnBsYW5rIiwiYSI6ImNrZzNobHI5dDAwZ3Yyem5qZ2ZjcWV5eTQifQ.2pfbEjS1qK2_T50pnuHXYQ'

const HOME = {
  lng: 12.877465129156315,
  lat: 47.72748263181004
}

function Map() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(HOME.lng)
  const [lat, setLat] = useState(HOME.lat)
  const [zoom, setZoom] = useState(13)
  const [bearing, setBearing] = useState(80)
  const [pitch, setPitch] = useState(95)

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
    })
  })

  useEffect(() => {
    if (!map.current) return

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // add a sky layer that will show when the map is highly pitched
      map.current.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      })

      new mapboxgl.Marker()
        .setLngLat([HOME.lng, HOME.lat])
        .addTo(map.current)
    })
  })

  const updateBearing = (event, value) => {
    setBearing(value)
    map.current.setBearing(bearing)
  }

  const updatePitch = (event, value) => {
    setPitch(value)
    map.current.setPitch(pitch)
  }

  return (
    <>
      <Card className={styles.controlsContainer}>
        <CardContent>
          <Typography gutterBottom>
            Bearing
          </Typography>
          <Slider defaultValue={80} min={0} max={360} onChange={updateBearing} />
          <Typography gutterBottom>
            Pitch
          </Typography>
          <Slider defaultValue={40} min={0} max={85} onChange={updatePitch} />
        </CardContent>
      </Card>
      <div ref={mapContainer} className={styles.mapContainer} />
    </>
  )
}


export default Map