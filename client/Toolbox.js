import React from 'react';

import styles from './Toolbox.css';

const blueHeight = 200;

export default class Toolbox extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.routeContainer}>
          <div className={styles.route} style={{ color: '#00f', height: blueHeight }}>
            <div className={styles.routeLabel}>60 min</div>
            <div className={styles.routePoint} />
          </div>
          <div className={styles.route} style={{ color: '#0d0', height: blueHeight / 2 }}>
            <div className={styles.routeLabel}>30 min</div>
            <div className={styles.routePoint} />
          </div>
          <div className={styles.route} style={{ color: '#f00', height: blueHeight / 4 }}>
            <div className={styles.routeLabel}>15 min</div>
            <div className={styles.routePoint} />
          </div>
        </div>
      </div>
    );
  }
}
