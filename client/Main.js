import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import ReactMapboxGl, { Feature, Layer } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiamFucGF1bDEyMyIsImEiOiJjamUyYW53M2s1cjl3MndxcDU2Nmw0NjJsIn0.HnUpXhgdSYq1bIuE44w-XA',
});

export default class Main extends React.Component {
  render() {
    const { data, onChange } = this.props;
    const { routes } = data;

    return (
      <Map
        style="mapbox://styles/janpaul123/cjk5x9kmi3y2x2ro9ezajmq50"
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
        center={[-122.4156983, 37.7709864]}
        zoom={[12]}
      >
        {Object.keys(routes).map(routeId => {
          const route = routes[routeId];
          return (
            <React.Fragment key={routeId}>
              <Layer type="circle" paint={{ 'circle-radius': 7, 'circle-color': route.color }}>
                {route.coordinates.map((coordinate, index) => (
                  <Feature
                    key={index}
                    coordinates={coordinate}
                    draggable
                    onDrag={mapWithEvt => {
                      const dataCopy = cloneDeep(data);
                      dataCopy.routes[routeId].coordinates[index] = [
                        mapWithEvt.lngLat.lng,
                        mapWithEvt.lngLat.lat,
                      ];
                      onChange(dataCopy);
                    }}
                  />
                ))}
              </Layer>
              <Layer type="line" paint={{ 'line-color': route.color, 'line-width': 4 }}>
                <Feature coordinates={route.coordinates} />
              </Layer>
            </React.Fragment>
          );
        })}
      </Map>
    );
  }
}
