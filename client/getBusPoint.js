import along from '@turf/along';
import length from '@turf/length';
import lineString from 'turf-linestring';

const simulatedMinutesPerSec = 3.5;

export default function getBusPoint(coordinates, headwayMin, inverse) {
  const linestring = lineString(coordinates);
  const lengthKm = length(linestring);
  const kmPerSec = lengthKm * 2 / headwayMin * simulatedMinutesPerSec;
  const doubleKmAlong = (Date.now() / 1000 * kmPerSec) % (lengthKm * 2);
  let kmAlong = doubleKmAlong > lengthKm ? 2 * lengthKm - doubleKmAlong : doubleKmAlong;
  if (inverse) kmAlong = lengthKm - kmAlong;
  return {
    point: along(linestring, kmAlong).geometry.coordinates,
    direction: inverse ? doubleKmAlong > lengthKm : doubleKmAlong <= lengthKm,
  };
}
