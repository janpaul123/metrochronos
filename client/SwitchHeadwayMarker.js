import cloneDeep from 'lodash/cloneDeep';
import React from 'react';

import { colorsByHeadway, hoverColorsByHeadway } from './constants';
import styles from './SwitchHeadwayMarker.css';

class SwitchHeadwayMarkerItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false };
  }

  _onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  _onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  _onClick = () => {
    const { data, onChange, routeId, headway } = this.props;
    const dataCopy = cloneDeep(data);
    dataCopy.routes[routeId] = {
      ...dataCopy.routes[routeId],
      headway,
    };
    onChange(dataCopy);
  };

  render() {
    const { headway } = this.props;
    return (
      <div
        className={styles.item}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        onClick={this._onClick}
        style={{
          background: this.state.hovered ? hoverColorsByHeadway[headway] : colorsByHeadway[headway],
        }}
      />
    );
  }
}

export default class SwitchHeadwayMarker extends React.Component {
  render() {
    const { routeId, data, onChange, onMouseEnter, onMouseLeave } = this.props;
    return (
      <div className={styles.root} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <SwitchHeadwayMarkerItem headway={15} routeId={routeId} data={data} onChange={onChange} />
        <SwitchHeadwayMarkerItem headway={30} routeId={routeId} data={data} onChange={onChange} />
        <SwitchHeadwayMarkerItem headway={60} routeId={routeId} data={data} onChange={onChange} />
      </div>
    );
  }
}
