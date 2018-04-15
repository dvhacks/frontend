import icsTheme from './ics_theme';

export const allThemes = [
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

  return icsTheme // Default theme
};
