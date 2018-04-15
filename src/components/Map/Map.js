import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

export class Map extends Component {
  render() {
    const {
      center,
      children,
      zoom
    } = this.props;

    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDfyKzBagkx1mlqM7t8PrUeIv-5RFqkMV4' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          {children}
        </GoogleMapReact>
      </div>
    );
  }
}

Map.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.object,
  children: PropTypes.any
};
