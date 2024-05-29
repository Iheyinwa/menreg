import PropTypes from 'prop-types'
 const InputField = ({type,title, props, onChange, note}) => {
  return (
    <div className='my-2 flex flex-col gap-3 w-full'>
      <label className="font-semibold text-[16px] inline-flex gap-2 items-center w-fit">
        {title}
      </label>
      <p>{note}</p>
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
  note: PropTypes.string,
  type: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};
export default InputField