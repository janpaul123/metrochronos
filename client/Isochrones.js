import { Feature, Layer } from 'react-mapbox-gl';
import React from 'react';

const averageWalkingSpeedKph = 5;

const metersToPixelsAtMaxZoom = (meters, latitude) =>
  meters / 0.075 / Math.cos(latitude * Math.PI / 180);

export default class Isochrones extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.locations.map(({ coordinate, minutesLeft }, index) => {
          const radiusInMeters = 1000 * averageWalkingSpeedKph * minutesLeft / 60;

          return (
            <Layer
              key={index}
              type="circle"
              paint={{
                'circle-radius': {
                  stops: [[0, 0], [20, metersToPixelsAtMaxZoom(radiusInMeters, coordinate[1])]],
                  base: 2,
                },
                'circle-color': '#ff0',
              }}
            >
              <Feature coordinates={coordinate} />
            </Layer>
          );
        })}
      </React.Fragment>
    );
  }
}
