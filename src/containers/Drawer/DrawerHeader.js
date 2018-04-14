import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import DrawerHeader from "../../components/Drawer/DrawerHeader";

DrawerHeader.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = (state) => {
  const { auth, theme, locale, dialogs } = state;

  return {
    auth,
    theme,
    locale,
    dialogs
  }
};

export default connect(
  mapStateToProps,
  { setDialogIsOpen }
)(DrawerHeader)
