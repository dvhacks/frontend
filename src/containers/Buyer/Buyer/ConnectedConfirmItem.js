import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ConfirmItem } from './ConfirmItem';

const IntlConfirmItem = injectIntl(ConfirmItem);

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps, {
})(IntlConfirmItem);
