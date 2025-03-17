import { GoogleMap } from '@react-google-maps/api';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/App';

export default function MapView() {
  const isLoaded = useContext(ThemeContext);
  const [center, setCenter] = useState({
    lat: 28.499359150742354,
    lng: 77.06975633821554
  });
  const [map, setMap] = useState(null);
  const [dragged, setDragged] = useState(false);

  const mapStyles = {
    height: '100%',
    width: '100%',
    borderRadius: '8px'
  };

  const options = {
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    scaleControl: false,
    keyboardShortcuts: false,
    fullscreenControl: false,
    mapTypeId: 'hybrid'
  };

  const onMapLoad = useCallback((map) => setMap(map), []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyles}
      onDrag={() => setDragged(true)}
      center={center}
      zoom={15}
      onLoad={onMapLoad}
      options={options}
    />
  ) : null;
}
