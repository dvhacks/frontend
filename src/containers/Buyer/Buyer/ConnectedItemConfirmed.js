import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ItemConfirmed } from './ItemConfirmed';

const IntlItemConfirmed = injectIntl(ItemConfirmed);

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
})(IntlItemConfirmed);
