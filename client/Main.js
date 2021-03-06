import React from 'react';
import ReactMapboxGl, { Feature, GeoJSONLayer, Layer, Marker, Popup } from 'react-mapbox-gl';
import cloneDeep from 'lodash/cloneDeep';
import times from 'lodash/times';
import uuid from 'uuid';

import { DraggablePin } from './Pin';
import { colorsByHeadway, hoverColorsByHeadway, secondaryColorsByHeadway } from './constants';
import Isochrones from './Isochrones';
import SwitchHeadwayMarker from './SwitchHeadwayMarker';
import Toolbox from './Toolbox';
import getBusPoint from './getBusPoint';
import getSplittedLines from './getSplittedLines';
import makeIsochrone from './makeIsochrone';
import styles from './Main.css';

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
  hoveringSwitchHeadwayMarker: undefined,
};

class BusRouteLines extends React.PureComponent {
  render() {
    const { splittedLines, headway } = this.props;
    return (
      <React.Fragment>
        {splittedLines.map((coordinates, index) => (
          <Layer
            key={index}
            type="line"
            paint={{
              'line-color':
                index % 2 === 0 ? colorsByHeadway[headway] : secondaryColorsByHeadway[headway],
              'line-width': 8,
            }}
          >
            <Feature coordinates={coordinates} />
          </Layer>
        ))}
      </React.Fragment>
    );
  }
}

class AnimatedBuses extends React.PureComponent {
  componentDidMount() {
    this._tick();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._raf);
  }

  _tick() {
    this.forceUpdate();
    this._raf = window.requestAnimationFrame(() => {
      this._tick();
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.splittedLines.map((coordinates, index) => {
          const { point, direction } = getBusPoint(
            coordinates,
            this.props.headway,
            index % 2 === 1
          );
          return (
            <Layer
              key={index}
              type="circle"
              paint={{ 'circle-color': direction ? 'white' : '#ccc', 'circle-radius': 6 }}
            >
              <Feature coordinates={point} />
            </Layer>
          );
        })}
      </React.Fragment>
    );
  }
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  _onDropPin = position => {
    const lngLat = this._map.state.map.unproject(position);
    const dataCopy = cloneDeep(this.props.data);
    dataCopy.pinLocation = [lngLat.lng, lngLat.lat];
    this.props.onChange(dataCopy);
  };

  render() {
    const { data, onChange } = this.props;
    const { routes } = data;

    const splittedLinesByRouteId = {};
    let usedBuses = 0;
    Object.keys(routes).forEach(routeId => {
      const route = routes[routeId];
      splittedLinesByRouteId[routeId] = getSplittedLines(routeId, route.coordinates, route.headway);
      usedBuses += splittedLinesByRouteId[routeId].length;
    });

    return (
      <React.Fragment>
        <div
          className={
            (this.state.showAddCoordinate || this.state.hoveringCircle) &&
            !this.state.draggingCircle
              ? styles.cursorPointer
              : undefined
          }
        >
          <Map
            style="mapbox://styles/janpaul123/cjk5x9kmi3y2x2ro9ezajmq50"
            containerStyle={{
              height: '100vh',
              width: '100vw',
            }}
            center={initialCenter}
            zoom={initialZoom}
            ref={c => (this._map = c)}
          >
            <Isochrones locations={makeIsochrone(data)} />
            {Object.keys(routes).map(routeId => {
              const route = routes[routeId];
              return (
                <React.Fragment key={routeId}>
                  <BusRouteLines
                    splittedLines={splittedLinesByRouteId[routeId]}
                    headway={route.headway}
                  />
                  <AnimatedBuses
                    splittedLines={splittedLinesByRouteId[routeId]}
                    headway={route.headway}
                  />
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
                      linePaint={{ 'line-color': 'transparent', 'line-width': 8 }}
                      lineOnMouseMove={event => {
                        const eventPixelPoint = event.target.project(event.lngLat);
                        const fromPixelPoint = event.target.project(
                          route.coordinates[segmentIndex]
                        );
                        const fromDistanceSquared =
                          Math.pow(eventPixelPoint.x - fromPixelPoint.x, 2) +
                          Math.pow(eventPixelPoint.y - fromPixelPoint.y, 2);
                        const toPixelPoint = event.target.project(
                          route.coordinates[segmentIndex + 1]
                        );
                        const toDistanceSquared =
                          Math.pow(eventPixelPoint.x - toPixelPoint.x, 2) +
                          Math.pow(eventPixelPoint.y - toPixelPoint.y, 2);
                        if (fromDistanceSquared > 10 * 10 && toDistanceSquared > 10 * 10) {
                          this.setState({
                            showAddCoordinate: {
                              routeId,
                              segmentIndex,
                              lngLat: [event.lngLat.lng, event.lngLat.lat],
                            },
                          });
                        } else {
                          this.setState({ showAddCoordinate: undefined });
                        }
                      }}
                      lineOnMouseLeave={() => this.setState({ showAddCoordinate: undefined })}
                    />
                  ))}
                  <Layer
                    type="circle"
                    paint={{ 'circle-radius': 10, 'circle-color': colorsByHeadway[route.headway] }}
                  >
                    {route.coordinates.map((coordinate, index) => (
                      <Feature
                        key={index}
                        coordinates={coordinate}
                        draggable
                        onMouseEnter={() => this.setState({ hoveringCircle: { routeId, index } })}
                        onMouseLeave={() => this.setState({ hoveringCircle: undefined })}
                        onDragStart={() => this.setState({ draggingCircle: { routeId, index } })}
                        onDragEnd={() => this.setState(initialState)}
                        onDrag={mapWithEvt => {
                          const dataCopy = cloneDeep(data);
                          dataCopy.routes[routeId].coordinates[index] = [
                            mapWithEvt.lngLat.lng,
                            mapWithEvt.lngLat.lat,
                          ];
                          onChange(dataCopy);
                        }}
                        onClick={() => {
                          if (this.state.draggingCircle) return;
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
                  {((this.state.draggingCircle && this.state.draggingCircle.routeId === routeId) ||
                    (this.state.hoveringCircle &&
                      this.state.hoveringCircle.routeId === routeId)) && (
                    <Layer
                      type="circle"
                      paint={{
                        'circle-radius': 10,
                        'circle-color': hoverColorsByHeadway[route.headway],
                      }}
                    >
                      <Feature
                        coordinates={
                          route.coordinates[
                            (this.state.draggingCircle || this.state.hoveringCircle).index
                          ]
                        }
                      />
                    </Layer>
                  )}
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
                          'circle-color': hoverColorsByHeadway[route.headway],
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
                          onMouseLeave={() => this.setState({ showAddCoordinate: undefined })}
                        />
                      </Layer>
                    )}
                  {!this.state.draggingCircle &&
                    ((this.state.hoveringSwitchHeadwayMarker &&
                      this.state.hoveringSwitchHeadwayMarker.routeId === routeId) ||
                      (this.state.hoveringCircle &&
                        this.state.hoveringCircle.routeId === routeId) ||
                      (this.state.showAddCoordinate &&
                        this.state.showAddCoordinate.routeId === routeId)) && (
                      <Marker
                        coordinates={route.coordinates[route.coordinates.length - 1]}
                        anchor="top"
                      >
                        <SwitchHeadwayMarker
                          routeId={routeId}
                          data={data}
                          onChange={onChange}
                          onMouseEnter={() =>
                            this.setState({ hoveringSwitchHeadwayMarker: { routeId } })
                          }
                          onMouseLeave={() =>
                            this.setState({ hoveringSwitchHeadwayMarker: undefined })
                          }
                        />
                      </Marker>
                    )}
                  {data.pinLocation && (
                    <Marker coordinates={data.pinLocation}>
                      <DraggablePin onDrop={this._onDropPin} />
                    </Marker>
                  )}
                </React.Fragment>
              );
            })}
          </Map>
        </div>
        <Toolbox
          usedBuses={usedBuses}
          onDropBus={(position, headway) => {
            const lngLat = this._map.state.map.unproject(position);
            const routeId = uuid.v4();
            const dataCopy = cloneDeep(data);
            dataCopy.routes[routeId] = {
              headway,
              coordinates: [[lngLat.lng, lngLat.lat], [lngLat.lng, lngLat.lat - 0.01]],
            };
            onChange(dataCopy);
          }}
          onDropPin={this._onDropPin}
        />
      </React.Fragment>
    );
  }
}
