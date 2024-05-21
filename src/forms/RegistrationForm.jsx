import InputCard from "../components/InputCard";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../components/Error";
import PropTypes from "prop-types";

const registrationSchema = yup.object({
    registration: yup
        .string()
        .required("Please select your Registration package"),
    });

const RegistrationForm = ({ icon, onChange }) => {
    const {
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registrationSchema),
    });

return (
    <InputCard icon={icon} tag="Registration">
        <div>
            <p className="text-[14px] font-semibold">
            What type of registration do you want?
            </p>
        <div className="my-1">
            <input
                type="radio"
                id="regularReg"
                value="regularRegistration"
                name="registration"
                onChange={onChange}
                {...register("registration")}
            />
            <label htmlFor="regularReg">
                Regular - #7,000 (Conference File Jacket )
            </label>
        </div>

        <div className="my-1">
            <input
                type="radio"
                id="hotelReg"
                value="hotelRegistration"
                name="registration"
                onChange={onChange}
                {...register("registration")}
            />
            <label htmlFor="hotelReg">
                Hotel - #50,000 (Conference Souvenir Bag/Wears/Materials, file etc)
            </label>
        </div>
    </div>
    {errors.registration && <Error error={errors.registration.message} />}
    </InputCard>
);
};

RegistrationForm.propTypes = {
    icon: PropTypes.node,
    onChange: PropTypes.func,
};
export default RegistrationForm;
