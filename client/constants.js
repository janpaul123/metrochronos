import tinycolor2 from 'tinycolor2';

export const averageBusSpeedKph = 10;

export const colorsByHeadway = {
  60: '#00f',
  30: '#0d0',
  15: '#f00',
};

export const secondaryColorsByHeadway = {
  60: tinycolor2(colorsByHeadway[60])
    .darken(20)
    .toString(),
  30: tinycolor2(colorsByHeadway[30])
    .darken(20)
    .toString(),
  15: tinycolor2(colorsByHeadway[15])
    .darken(20)
    .toString(),
};

export const hoverColorsByHeadway = {
  60: tinycolor2(colorsByHeadway[60])
    .brighten(20)
    .toString(),
  30: tinycolor2(colorsByHeadway[30])
    .brighten(20)
    .toString(),
  15: tinycolor2(colorsByHeadway[15])
    .brighten(20)
    .toString(),
};
