import React, { Component, Fragment } from 'react';
import {
  AppBar
} from 'material-ui';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Map } from '../../../components/Map/Map';
import { PickupPoint } from '../../../components/Map/PickupPoint';
import { haversineDistance } from '../../../utils/googleMaps';

export class ItemConfirmed extends Component {
  constructor(props) {
    super(props);
    
    this.onPickupPointClick = this.onPickupPointClick.bind(this);
  }
  
  onPickupPointClick(e) {
    const start = { lat: 33.900612, lng: -118.392683 };
    const end = { lat: 34.042941, lng: -118.241591 };
    const distance = haversineDistance(start, end);
    
    console.log({ distance });
  }
  
  render() {
    return (
      <Fragment>
        <AppBar title="Confirmed" showMenuIconButton={false} />
        <Map
          center={{ lat: 33.90, lng: -118.39 }}
          zoom={11}
        >
          <PickupPoint
            lat={33.90}
            lng={-118.39}
            onClick={this.onPickupPointClick}
          />
        </Map>
      </Fragment>
    );
  }
}

ItemConfirmed.propTypes = {
  intl: intlShape.isRequired
};
