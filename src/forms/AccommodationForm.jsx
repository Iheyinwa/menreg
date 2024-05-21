import InputCard from "../components/InputCard";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../components/Error";
import PropTypes from "prop-types";
import { useState } from "react";

const accommodationSchema = yup.object({
    accommodation: yup.object().shape({
        value: yup.string().required("Please select your preferred Accommodation"),
    }),
});

const chapters = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
];

const AccommodationForm = ({ icon, onChange, control}) => {
    const {
        formState: { errors },
    } = useForm({
        resolver: yupResolver(accommodationSchema),
    });

    
    const [hotel, setHotel] = useState(false);

return (
  <InputCard icon={icon} tag="Accommodation">
    <div>
      <p className="text-[14px] font-semibold">
        What type of accommodation do you want?
      </p>
      <div
        className="my-1"
        onClick={() => {
          setHotel(false);
        }}
      >
        <Controller
          name="gsm1"
          control={control}
          label="Hostel - #7,000"
          render={({ field }) => (
            <>
              <input
                type="radio"
                value="hostel"
                name="accommodation"
                onChange={onChange}
                {...field}
              />
              <label htmlFor="hostel">Hostel</label>
            </>
          )}
        />
      </div>

      <div
        className="my-1"
        onClick={() => {
          setHotel(true);
        }}
      >
        <input
          type="radio"
          value="hotel"
          name="accommodation"
          onChange={onChange}
        />
        <label htmlFor="hotel">Hotel</label>
      </div>

      {hotel && (
        <Controller
          name="accommodation"
          control={control}
          className="my-2"
          render={({ field }) => (
            <Select
              {...field}
              options={chapters}
              placeholder="Select your preferred Hotel"
            />
          )}
        />
      )}

      <div className="my-1" onClick={() => setHotel(false)}>
        <Controller
          name="gsm1"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="radio"
                value="personalArrangement"
                name="accommodation"
                onChange={onChange}
                {...field}
              />
              <label htmlFor="personalArrangement">Personal Arrangement</label>
            </>
          )}
        />
      </div>
    </div>
    {errors.accommodation && (
      <Error error={errors.accommodation.value.message} />
    )}
  </InputCard>
);
};

AccommodationForm.propTypes = {
  icon: PropTypes.node,
  onChange: PropTypes.func,
  control: PropTypes.object.isRequired,
};
export default AccommodationForm;
