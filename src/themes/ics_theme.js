import {
  pinkA100,
  pinkA200,
  pinkA400,
  fullWhite
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

export default {
  palette: {
    primary1Color: '#66bf9a',
    primary2Color: '#58cd9d',
    primary3Color: '#3fb082',
    accent1Color: pinkA200,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
    textColor: fullWhite,
    secondaryTextColor: fade(fullWhite, 0.7),
    alternateTextColor: '#303030',
    canvasColor: '#303030',
    borderColor: fade(fullWhite, 0.3),
    disabledColor: fade(fullWhite, 0.3),
    pickerHeaderColor: fade(fullWhite, 0.12),
    clockCircleColor: fade(fullWhite, 0.12)
  }
};
