import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import Toggle from 'material-ui/Toggle';
import allLocales from './locales';
import {allThemes} from './themes';

const getMenuItems = (props) => {
  const {
    responsiveDrawer,
    setResponsive,
    theme,
    locale,
    updateTheme,
    updateLocale,
    intl,
    muiTheme,
    auth,
    isGranted
  } = props;

  const isAuthorised = auth.isAuthorised;

  const themeItems = allThemes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => {
        updateTheme(t.id);
      },
      rightIcon: <FontIcon
        className="material-icons"
        color={t.id === theme ? muiTheme.palette.primary1Color : undefined}>
        style
      </FontIcon>
    };
  });

  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale);
      },
      rightIcon: <FontIcon
        className="material-icons"
        color={l.locale === locale ? muiTheme.palette.primary1Color : undefined}>
        language
      </FontIcon>
    };
  });

  return [
    {
      value: '/dashboard',
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: 'dashboard' }),
      leftIcon: <FontIcon className="material-icons" >dashboard</FontIcon>
    },
    {
      value: '/shipments',
      visible: isGranted('read_shipments'),
      primaryText: intl.formatMessage({ id: 'shipments', defaultMessage: 'My Shipments' }),
      leftIcon: <FontIcon className="material-icons" >mail_outline</FontIcon>
    },
    {
      visible: isAuthorised, // In prod: isGranted('administration'),
      primaryTogglesNestedList: true,
      primaryText: intl.formatMessage({ id: 'administration' }),
      leftIcon: <FontIcon className="material-icons" >security</FontIcon>,
      nestedItems: [
        {
          value: '/users',
          visible: isAuthorised, // In prod: isGranted('read_users'),
          primaryText: intl.formatMessage({ id: 'users' }),
          leftIcon: <FontIcon className="material-icons" >group</FontIcon>
        },
        {
          value: '/roles',
          visible: isGranted('read_roles'),
          primaryText: intl.formatMessage({ id: 'roles' }),
          leftIcon: <FontIcon className="material-icons" >account_box</FontIcon>
        }
      ]
    },
    {
      divider: true,
      visible: isAuthorised
    },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primaryTogglesNestedList: true,
      leftIcon: <FontIcon className="material-icons" >settings</FontIcon>,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: 'theme' }),
          secondaryText: intl.formatMessage({ id: theme }),
          primaryTogglesNestedList: true,
          leftIcon: <FontIcon className="material-icons" >style</FontIcon>,
          nestedItems: themeItems
        },
        {
          primaryText: intl.formatMessage({ id: 'language' }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <FontIcon className="material-icons" >language</FontIcon>,
          nestedItems: localeItems
        },
        {
          primaryText: intl.formatMessage({ id: 'responsive' }),
          leftIcon: <FontIcon className="material-icons" >chrome_reader_mode</FontIcon>,
          rightToggle: <Toggle
            toggled={responsiveDrawer.responsive}
            onToggle={
              () => {
                setResponsive(!responsiveDrawer.responsive);
              }
            }
          />
        }
      ]
    }
  ];
};

export default getMenuItems;
