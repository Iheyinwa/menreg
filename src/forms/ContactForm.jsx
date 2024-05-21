import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Error from "../components/Error";
import { useState } from "react";
import Select from "react-select";
import InputField from "../components/InputField";
import InputCard from "../components/InputCard";
import { FaCheckCircle } from "react-icons/fa";
import { useRegistration } from "../context/useRegistration";

const contactsSchema = yup.object({
  whatsappNumber: yup.string().required("Your Whatsapp Number is required"),
  gsm1: yup.string().required("Your GSM1 is required"),
  gsm2: yup.string(),
  isAg: yup.boolean(),
  AGChapters: yup
    .object()
    .shape({
      value: yup.string("Please select your AG Chapter").nullable(),
    })
    .nullable(),
  church: yup.string().when("isAg", {
    is: false,
    then: yup.string().required("Please indicate your church organization"),
  }),
});

const chapters = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const ContactForm = () => {
  const {
    control,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(contactsSchema),
    mode: "onChange",
  });

  const { updateFormRegistration } = useRegistration();
  const [isAg, setIsAg] = useState(null);

  const handleChange = (name, value) => {
    updateFormRegistration(name, value);
    setValue(name, value, { shouldValidate: true });
  };

  const handleIsAgChange = (value) => {
    setIsAg(value);
    handleChange("isAg", value);
    if (value) {
      handleChange("church", "");
    } else {
      handleChange("AGChapters", null);
    }
  };

  return (
    <InputCard
      icon={
        isValid ? (
          <FaCheckCircle color="green" size={25} />
        ) : (
          <FaCheckCircle color="black" size={25} />
        )
      }
      tag="Contacts"
    >
      <Controller
        name="whatsappNumber"
        control={control}
        render={({ field }) => (
          <InputField
            type="tel"
            {...field}
            title="Whatsapp Number: "
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
          />
        )}
      />
      {errors.whatsappNumber && <Error error={errors.whatsappNumber.message} />}

      <Controller
        name="gsm1"
        control={control}
        render={({ field }) => (
          <InputField
            type="tel"
            {...field}
            title="GSM 1: "
            onChange={(e) => handleChange("gsm1", e.target.value)}
          />
        )}
      />
      {errors.gsm1 && <Error error={errors.gsm1.message} />}

      <Controller
        name="gsm2"
        control={control}
        render={({ field }) => (
          <InputField
            type="tel"
            {...field}
            title="GSM 2: "
            onChange={(e) => handleChange("gsm2", e.target.value)}
          />
        )}
      />

      <div>
        <p className="text-[14px] font-semibold">Are you an AG Member?</p>
        <div className="my-1">
          <input
            type="radio"
            id="agYes"
            name="isAg"
            checked={isAg === true}
            onChange={() => handleIsAgChange(true)}
          />
          <label htmlFor="agYes">Yes</label>
        </div>

        <div className="my-1">
          <input
            type="radio"
            id="agNo"
            name="isAg"
            checked={isAg === false}
            onChange={() => handleIsAgChange(false)}
          />
          <label htmlFor="agNo">No</label>
        </div>
      </div>

      {isAg !== null && (
        <>
          {isAg ? (
            <Controller
              name="AGChapters"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={chapters}
                  placeholder="Select your AG Chapter"
                  onChange={(selectedOption) =>
                    handleChange("AGChapters", selectedOption)
                  }
                />
              )}
            />
          ) : (
            <Controller
              name="church"
              control={control}
              render={({ field }) => (
                <InputField
                  type="text"
                  {...field}
                  title="Please indicate your church organization"
                  onChange={(e) => handleChange("church", e.target.value)}
                />
              )}
            />
          )}
        </>
      )}
    </InputCard>
  );
};


export default ContactForm;
