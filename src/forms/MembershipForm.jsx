import InputCard from "../components/InputCard";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../components/Error";
import PropTypes from "prop-types";

const membershipSchema = yup.object({
    membership: yup.string().required("Please choose your Membership Status"),
});


const MembershipForm = ({ icon, onChange }) => {
    const {
        register,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(membershipSchema),
    });


return (
    <InputCard icon={icon} tag="Membership">
        <div>
            <p className="text-[14px] font-semibold">
            What is your membership status in the Men&apos;s Ministries?
            </p>
            <div className="my-1">
            <input
                type="radio"
                id="Pastor"
                name="membership"
                onChange={onChange}
                {...register("membership")}
            />
            <label htmlFor="Pastor">Minister (Pastor)</label>
            </div>

            <div className="my-1">
            <input
                type="radio"
                id="layPerson"
                name="membership"
                onChange={onChange}
                {...register("membership")}
            />
            <label htmlFor="layPerson">Non Pastoral (LayPerson)</label>
            </div>

            <div className="my-1">
            <input
                type="radio"
                id="nonAG"
                name="membership"
                onChange={onChange}
                {...register("membership")}
            />
            <label htmlFor="nonAG">Non AG (but wish to attend)</label>
            </div>
        </div>
        {errors.membership && <Error error={errors.membership.message} />}
    </InputCard>
);
};

MembershipForm.propTypes = {
    icon: PropTypes.node,
    onChange: PropTypes.func,
};
export default MembershipForm;
