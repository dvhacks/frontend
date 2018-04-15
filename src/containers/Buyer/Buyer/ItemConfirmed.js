import React, { Component, Fragment } from 'react';
import {
  AppBar
} from 'material-ui';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Map } from '../../../components/Map/Map';
import { PickupPoint } from '../../../components/Map/PickupPoint';

export class ItemConfirmed extends Component {
  constructor(props) {
    super(props);
    
    this.onPickupPointClick = this.onPickupPointClick.bind(this);
  }
  
  onPickupPointClick(e) {
    console.log({ e });
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
