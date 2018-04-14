import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Buyer } from './Buyer';

const IntlBuyer = injectIntl(Buyer);

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
})(IntlBuyer);



