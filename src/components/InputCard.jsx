import PropTypes from "prop-types"


const InputCard = ({children, tag}) => {

  return (
    <section className="border rounded-lg shadow border-gray-200 p-4 my-4">
      <div className=" inline-flex gap-2 items-start cursor-pointer w-full">
        <div className="flex flex-col gap-2 w-full">
          <p
            className="font-semibold text-[18px]"
          >
            {tag}
          </p>
          {children}
          
        </div>
      </div>
    </section>
  );
}

InputCard.propTypes = {
    children: PropTypes.node,
    tag: PropTypes.string,
}
export default InputCard