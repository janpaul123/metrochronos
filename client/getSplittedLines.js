import length from '@turf/length';
import lineString from 'turf-linestring';
import lineSliceAlong from '@turf/line-slice-along';
import times from 'lodash/times';

import {averageBusSpeedKph} from './constants';

const minimumSplitLineLengthKm = 0.35;

const cache = {};
export default function getSplittedLines(routeId, coordinates, headwayMins) {
  if (
    !cache[routeId] ||
    cache[routeId].coordinates !== coordinates ||
    cache[routeId].headwayMins !== headwayMins
  ) {
    const headwayHours = headwayMins / 60;
    const splitLineLengthKm = averageBusSpeedKph * headwayHours / 2; // divide by 2 because of roundtrip.
    const linestring = lineString(coordinates);
    const lengthKm = length(linestring);
    const numberOfSplitLines = Math.ceil(lengthKm / splitLineLengthKm);

    const splittedLines = times(numberOfSplitLines).map(
      index =>
        lineSliceAlong(linestring, index * splitLineLengthKm, (index + 1) * splitLineLengthKm)
          .geometry.coordinates
    );
    if (
      splittedLines.length > 1 &&
      length(lineString(splittedLines[splittedLines.length - 1])) < minimumSplitLineLengthKm
    ) {
      splittedLines[splittedLines.length - 2] = [
        ...splittedLines[splittedLines.length - 2],
        ...splittedLines[splittedLines.length - 1],
      ];
      delete splittedLines[splittedLines.length - 1];
    }
    cache[routeId] = {
      coordinates,
      headwayMins,
      splittedLines,
    };
  }

  return cache[routeId].splittedLines;
}
