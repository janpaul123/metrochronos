import React from 'react';
import ReactMapboxGl, { Feature, GeoJSONLayer, Layer, Popup } from 'react-mapbox-gl';
import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiamFucGF1bDEyMyIsImEiOiJjamUyYW53M2s1cjl3MndxcDU2Nmw0NjJsIn0.HnUpXhgdSYq1bIuE44w-XA',
});

const initialCenter = [-122.4156983, 37.7709864];
const initialZoom = [12];
const initialState = {
  showAddCoordinate: undefined,
  hoveringCircle: undefined,
  draggingCircle: undefined,
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

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
        center={initialCenter}
        zoom={initialZoom}
      >
        {Object.keys(routes).map(routeId => {
          const route = routes[routeId];
          return (
            <React.Fragment key={routeId}>
              {times(route.coordinates.length - 1, segmentIndex => (
                <GeoJSONLayer
                  key={segmentIndex}
                  data={{
                    type: 'LineString',
                    coordinates: [
                      route.coordinates[segmentIndex],
                      route.coordinates[segmentIndex + 1],
                    ],
                  }}
                  linePaint={{ 'line-color': route.color, 'line-width': 7 }}
                  lineOnMouseMove={event =>
                    this.setState({
                      showAddCoordinate: {
                        routeId,
                        segmentIndex,
                        lngLat: [event.lngLat.lng, event.lngLat.lat],
                      },
                    })
                  }
                  lineOnMouseLeave={() => this.setState({ showAddCoordinate: undefined })}
                />
              ))}
              <Layer type="circle" paint={{ 'circle-radius': 10, 'circle-color': route.color }}>
                {route.coordinates.map((coordinate, index) => (
                  <Feature
                    key={index}
                    coordinates={coordinate}
                    draggable
                    onMouseEnter={() => this.setState({ hoveringCircle: { routeId, index } })}
                    onMouseLeave={() => this.setState({ hoveringCircle: undefined })}
                    onDragStart={() => this.setState({ draggingCircle: true })}
                    onDragEnd={() => this.setState({ draggingCircle: undefined })}
                    onDrag={mapWithEvt => {
                      const dataCopy = cloneDeep(data);
                      dataCopy.routes[routeId].coordinates[index] = [
                        mapWithEvt.lngLat.lng,
                        mapWithEvt.lngLat.lat,
                      ];
                      this.setState(initialState, () => onChange(dataCopy));
                    }}
                    onClick={() => {
                      const dataCopy = cloneDeep(data);
                      if (dataCopy.routes[routeId].coordinates.length > 2) {
                        dataCopy.routes[routeId].coordinates.splice(index, 1);
                      } else {
                        delete dataCopy.routes[routeId];
                      }
                      this.setState(initialState, () => onChange(dataCopy));
                    }}
                  />
                ))}
              </Layer>
              {!this.state.draggingCircle &&
                this.state.hoveringCircle &&
                this.state.hoveringCircle.routeId === routeId && (
                  <Popup
                    coordinates={route.coordinates[this.state.hoveringCircle.index]}
                    style={{ fontSize: 10 }}
                    offset={10}
                  >
                    drag to move, click to delete
                  </Popup>
                )}
              {!this.state.draggingCircle &&
                !this.state.hoveringCircle &&
                this.state.showAddCoordinate &&
                this.state.showAddCoordinate.routeId === routeId && (
                  <Layer
                    type="circle"
                    paint={{
                      'circle-radius': 10,
                      'circle-color': route.color,
                      'circle-opacity': 0.5,
                    }}
                  >
                    <Feature
                      coordinates={this.state.showAddCoordinate.lngLat}
                      onClick={() => {
                        const dataCopy = cloneDeep(data);
                        const { lngLat, segmentIndex } = this.state.showAddCoordinate;
                        dataCopy.routes[routeId].coordinates = [
                          ...dataCopy.routes[routeId].coordinates.slice(0, segmentIndex + 1),
                          lngLat,
                          ...dataCopy.routes[routeId].coordinates.slice(segmentIndex + 1),
                        ];
                        this.setState(initialState, () => onChange(dataCopy));
                      }}
                    />
                  </Layer>
                )}
            </React.Fragment>
          );
        })}
      </Map>
    );
  }
}
