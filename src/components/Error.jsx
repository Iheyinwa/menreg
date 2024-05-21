import PropTypes from 'prop-types'

const Error = ({error}) => {
  return <p className="text-red-900">{error}</p>;
}

Error.propTypes = {
    error: PropTypes.string
}

export default Error