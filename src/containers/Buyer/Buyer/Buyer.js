import React, { Component, Fragment } from 'react';
import {
  AppBar,
  FlatButton,
  MenuItem,
  SelectField,
} from 'material-ui';
import { buttonOptions, selectFieldOptions } from '../../options';
import { intlShape } from 'react-intl';
import PropTypes from 'prop-types';

export class Buyer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedItem: null,
      selectedCourier: null
    };
    
    this.selectItem = this.selectItem.bind(this);
    this.selectCourier = this.selectCourier.bind(this);
  }
  
  selectItem(event, key, payload) {
    const { items } = this.props;
    const selectedItem = items.find(item => item.id === payload);
    
    this.setState({ selectedItem });
  }
  
  selectCourier(event, key, payload) {
    const { couriers } = this.props;
    const selectedCourier = couriers.find(courier => courier.id === payload);

    this.setState({ selectedCourier });
  }
  
  render() {
    const { items, couriers } = this.props;
    const {
      couriersEnabled,
      selectedCourier,
      selectedItem
    } = this.state;
    const buttonDisabled = selectedItem === null || selectedCourier === null;

    return (
      <Fragment>
        <AppBar title="Buyer" showMenuIconButton={false} />
        <SelectField
          {...selectFieldOptions}
          floatingLabelText="Choose an item"
          onChange={this.selectItem}
          value={selectedItem ? selectedItem.id : null}
        >
          {items.map((item, idx) => {
            const { id, label } = item;

            return <MenuItem key={idx} value={id} primaryText={label} />;
          })}
        </SelectField>

        <SelectField
          {...selectFieldOptions}
          disabled={selectedItem === null}
          floatingLabelText="Choose a courier"
          onChange={this.selectCourier}
          value={selectedCourier ? selectedCourier.id : null}
        >
          {couriers.map((item, idx) => {
            const { id, label } = item;

            return <MenuItem key={idx} value={id} primaryText={label} />;
          })}
        </SelectField>
        <FlatButton
          {...buttonOptions}
          disabled={buttonDisabled}
        >
          {buttonDisabled ? 'Choose items' : 'Continue'}
        </FlatButton>
      </Fragment>
    );
  }
}

const MenuItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
});

Buyer.propTypes = {
  intl: intlShape.isRequired,
  items: PropTypes.arrayOf(MenuItemShape),
  couriers: PropTypes.arrayOf(MenuItemShape)
};

Buyer.defaultProps = {
  items: [],
  couriers: []
};
