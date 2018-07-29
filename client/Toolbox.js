import React from 'react';
import ReactDocumentEvents from 'react-document-events';

import { colorsByHeadway, hoverColorsByHeadway } from './constants';
import styles from './Toolbox.css';

const blueHeight = 200;

class DraggablePoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false, dragging: undefined };
  }

  _onMouseDown = event => {
    const boundingRect = event.currentTarget.getBoundingClientRect();
    this.setState({
      dragging: {
        offset: { x: event.pageX - boundingRect.left, y: event.pageY - boundingRect.top },
        position: { x: boundingRect.left, y: boundingRect.top },
        size: { width: boundingRect.width, height: boundingRect.height },
      },
    });
  };

  _onMouseMove = event => {
    this.setState(state => ({
      dragging: {
        ...state.dragging,
        position: {
          x: event.pageX - state.dragging.offset.x,
          y: event.pageY - state.dragging.offset.y,
        },
      },
    }));
  };

  _onMouseUp = () => {
    const { position, size } = this.state.dragging;
    this.props.onDrop(
      { x: position.x + size.width / 2, y: position.y + size.height / 2 },
      this.props.headway
    );
    this.setState({ dragging: undefined, hovered: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.dragging ? (
          <div className={styles.draggingLayer}>
            <div
              className={styles.routePointDragging}
              style={{
                background: hoverColorsByHeadway[this.props.headway],
                position: 'fixed',
                left: this.state.dragging.position.x,
                top: this.state.dragging.position.y,
              }}
            />
          </div>
        ) : (
          <div
            className={styles.routePoint}
            onMouseEnter={() => this.setState({ hovered: true })}
            onMouseLeave={() => this.setState({ hovered: false })}
            onMouseDown={this._onMouseDown}
            style={{
              background:
                this.state.hovered || this.state.dragging
                  ? hoverColorsByHeadway[this.props.headway]
                  : colorsByHeadway[this.props.headway],
            }}
          />
        )}
        <ReactDocumentEvents
          enabled={!!this.state.dragging}
          onMouseMove={this._onMouseMove}
          onMouseUp={this._onMouseUp}
        />
      </React.Fragment>
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
        <DraggablePoint headway={headway} onDrop={this.props.onDrop} />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.routeHeader}>bus routes</div>
        <div className={styles.routeSubHeader}>(try dragging them!)</div>
        <div className={styles.routeContainer}>
          {this._renderRoute(60)}
          {this._renderRoute(30)}
          {this._renderRoute(15)}
        </div>
      </div>
    );
  }
}
