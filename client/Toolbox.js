import React from 'react';

import { colorsByHeadway, hoverColorsByHeadway } from './constants';
import styles from './Toolbox.css';

const blueHeight = 200;

class DraggablePoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false };
  }

  render() {
    return (
      <div
        className={styles.routePoint}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        styles={{
          background: this.state.hovered
            ? colorsByHeadway[this.props.headway]
            : hoverColorsByHeadway[this.props.headway],
        }}
      />
    );
  }
}

export default class Toolbox extends React.Component {
  _renderRoute(headway) {
    return (
      <div
        className={styles.route}
        style={{ color: colorsByHeadway[headway], height: blueHeight * (headway / 60) }}
      >
        <div className={styles.routeLabel}>{headway} min</div>
        <DraggablePoint headway={headway} />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.routeContainer}>
          {this._renderRoute(60)}
          {this._renderRoute(30)}
          {this._renderRoute(15)}
        </div>
      </div>
    );
  }
}
