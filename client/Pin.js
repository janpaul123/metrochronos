import React from 'react';
import ReactDocumentEvents from 'react-document-events';

import styles from './Pin.css';

export class Pin extends React.Component {
  render() {
    return (
      <div className={styles.root} onMouseDown={this.props.onMouseDown} style={this.props.style}>
        <div className={styles.pin}>📍</div>
      </div>
    );
  }
}

export class DraggablePin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dragging: undefined };
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
    this.props.onDrop({ x: position.x + size.width / 2, y: position.y + size.height / 2 });
    this.setState({ dragging: undefined });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.dragging ? (
          <div className={styles.draggingLayer}>
            <Pin
              style={{
                position: 'fixed',
                left: this.state.dragging.position.x,
                top: this.state.dragging.position.y,
              }}
            />
          </div>
        ) : (
          <Pin onMouseDown={this._onMouseDown} />
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
