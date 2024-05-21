import PropTypes from 'prop-types'
 const InputField = ({type,title, props, onChange}) => {
  return (
    <div className='my-2 flex flex-col gap-2 w-full'>
      <label className="font-semibold text-[14px] inline-flex gap-2 items-center">
        {title}
      </label>
      <input
        type={type}
        className="border-b border-b-gray-200"
        {...props}
        onChange={onChange}
      />
    </div>
  );
}

InputField.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};
export default InputField