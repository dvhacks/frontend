import icsTheme from './ics_theme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

export const allThemes = [
  {
    id: 'light',
    source: lightBaseTheme
  },
  {
    id: 'dark',
    source: darkBaseTheme
  },
  {
    id: 'ics',
    source: icsTheme
  }
];

export const getThemeSource = (t, ts) => {
  if (ts) {
    for (let i = 0; i < ts.length; i++) {
      if (ts[i]['id'] === t) {
        return ts[i]['source']
      }
    }
  }

  return lightBaseTheme // Default theme
};
