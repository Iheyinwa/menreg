import "./App.css";
import InputField from "./components/InputField";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {  FaUser } from "react-icons/fa";
import * as yup from "yup";
import Error from "./components/Error.jsx";
import InputCard from "./components/InputCard.jsx";
import Select from "react-select";
import { useState } from "react";
import { collection, addDoc} from "firebase/firestore";
import { db } from "./firebase";
import PaystackPop from "@paystack/inline-js";
import { FaSpinner } from "react-icons/fa6";
import { districts } from "./data/districts.js";
import { hotelAccommodations } from "./data/hotels.js";

// name schema
const schema = yup.object().shape({
  surname: yup.string().required("Your Surname is required"),
  firstName: yup.string().required("Your First Name is required"),
  otherName: yup.string().required("Your Other Name(s) is required"),
  email: yup.string().email("Invalid email format").required("Your Email is required"),
  whatsappNumber: yup.string().required("Your Whatsapp Number is required"),
  gsm1: yup.string().required("Your GSM1 is required"),
  gsm2: yup.string().nullable(),
  isAg: yup.boolean().required("Please indicate if you are an AG member"),
  membership: yup.string().required("Please choose your Membership Status"),
  accommodation: yup.object().shape({
    value: yup.string().required("Please select your preferred Accommodation"),
  }),
  registration: yup
    .string()
    .required("Please select your Registration package"),
});

function App() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      surname: "",
      firstName: "",
      otherName: "",
      email: ""
    }
  });

  // const [count, setCount ] = useState(0)
  // const [names, setNames ] = useState(0)
  const [isAg, setIsAg] = useState(null);
  const [hotel, setHotel] = useState(false);
  const [hostel, setHostel] = useState(false);
  const [regular, setRegular] = useState(false);
  const [hotelReg, setHotelReg] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);


  const onSubmit = async (data) => {
  let totalAmount = 0;
  // Registration Amount
  if (data.registration === "Regular") {
    totalAmount += 5000;
  } else {
    totalAmount += 50000;
  }
  console.log("Original data:", data);

  // Extract the value from the AGChapter select
  const agChapterValue = data.AGChapter?.value;
  const accommodationValue = {
    value: data.accommodation?.value,
  };
  const registrationValue = {
    value: data.registration,
    amount: totalAmount
  };

  // Create a new data object with only the necessary values
  const cleanedData = {
    ...data,
    AGChapter: agChapterValue,
    accommodation: accommodationValue,
    registration: registrationValue,
  };
  

  // console.log("Cleaned data:", cleanedData);

  // Proceed with the cleaned data
  setIsSubmitting(true);

  try {
    const userDataRef = await addDoc(collection(db, "userData"), {
      userData: cleanedData,
    });
    console.log("User Data written with ID: ", userDataRef);
  } catch (e) {
    console.log("Error Submitting information: ", errors);
  }

  // const paystackKey = import.meta.env.VITE_PUBLIC_KEY
  const paystack = new PaystackPop();
  paystack.newTransaction({
    key: "pk_test_329bae1515829f5cc3ecb279536da5476e395dda",
    email: cleanedData.email,
    amount: totalAmount * 100,

    onSuccess: () => {
      setIsSubmitting(false);
    },
    onCancel: () => {
      setIsSubmitting(false);
    },
  });
  reset();
  };

  // useEffect(() => {
  //   const subscription = watch((value, { name}) => {
  //     if (name === 'surname' || name === 'firstName' || name === 'otherName' || name === 'email') {
  //       const allValid = schema.isValidSync({
  //         surname: value.surname,
  //         firstName: value.firstName,
  //         otherName: value.otherName,
  //         email: value.email
  //       });
  //       console.log(value.surname)
  //       if (allValid) {
  //         setNames(1);
  //         setCount(prevCount => prevCount + 1);
  //       } else {
  //         setNames(0);
  //       }
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);


  return (
    <section>
      <section className="flex justify-center items-center">
        <section className="w-[80%] md:w-[60vw]">
          <h1 className="text-center text-2xl font-bold my-2">
            2024 NATIONAL MEN&apos;S CONVENTION
          </h1>
          <p className="font-bold text-center my-2">
            International Worship Center, Uyo Akwa Ibom State (July 22 - 26,
            2024)
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="bg-white rounded-xl p-4 my-4 drop-shadow-md">
              <div>
                <div className="flex justify-between items-center my-2">
                  <div className="inline-flex gap-2 items-center">
                    <div className="bg-blue-600 border border-blue-600 rounded-[5px] p-[2px]">
                      <FaUser color="white" />
                    </div>
                    <h2 className="font-bold text-lg">
                      Registration of Participants
                    </h2>
                  </div>
                  {/* <div className="inline-flex gap-2 items-center">
                    <input
                      type="range"
                      id="taskProgress"
                      min="0"
                      max="5"
                      value={count}
                      className="w-fit"
                    />
                    <p>{count} of 5 tasks</p>
                  </div> */}
                </div>
                <div className="my-2">
                  <p className="underline">For more information contact</p>
                  <p>Amb. Samuel Archibong</p>
                  <p className="font-medium">
                    Chairman of the LOC - 08027175460
                  </p>
                </div>
              </div>

              <section className="max-h-[70vh] overflow-y-auto my-4">
                {/* NAMES */}
                <InputCard
                  tag="Names"
                >
                  <InputField
                    type="text"
                    title="Surname: "
                    props={{ ...register("surname") }}
                  />
                  {errors.surname && <Error error={errors.surname.message} />}
                  <InputField
                    type="text"
                    title="FirstName: "
                    props={{ ...register("firstName") }}
                  />
                  {errors.firstName && (
                    <Error error={errors.firstName.message} />
                  )}
                  <InputField
                    type="text"
                    title="Other(s) Name: "
                    props={{ ...register("otherName") }}
                  />
                  {errors.otherName && (
                    <Error error={errors.otherName.message} />
                  )}
                  <InputField
                    type="email"
                    title="Email: "
                    props={{ ...register("email") }}
                  />
                  {errors.email && <Error error={errors.email.message} />}
                </InputCard>

                {/* CONTACTS */}
                <InputCard tag="Contacts">
                  <InputField
                    type="tel"
                    title="Whatsapp Number: "
                    props={{ ...register("whatsappNumber") }}
                  />
                  {errors.whatsappNumber && (
                    <Error error={errors.whatsappNumber.message} />
                  )}
                  <InputField
                    type="tel"
                    title="GSM1: "
                    props={{ ...register("gsm1") }}
                  />
                  {errors.gsm1 && <Error error={errors.gsm1.message} />}
                  <InputField
                    type="tel"
                    title="GSM2: "
                    props={{ ...register("gsm2") }}
                  />
                  {errors.gsm2 && <Error error={errors.gsm2.message} />}
                  <div>
                    <p className="text-[14px] font-semibold">
                      Are you an AG Member?
                    </p>
                    <div className="my-1">
                      <input
                        type="radio"
                        value="true"
                        {...register("isAg")}
                        onClick={() => setIsAg(true)}
                      />
                      <label htmlFor="agYes" className="px-1">
                        Yes
                      </label>
                    </div>

                    <div className="my-1">
                      <input
                        type="radio"
                        value="false"
                        {...register("isAg")}
                        onClick={() => setIsAg(false)}
                      />
                      <label htmlFor="agNo" className="px-1">
                        No
                      </label>
                    </div>
                  </div>
                  {isAg !== null && (
                    <>
                      {isAg ? (
                        <Controller
                          name="AGChapter"
                          className="my-2"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={districts}
                              placeholder="Select your AG Chapter"
                            />
                          )}
                        />
                      ) : (
                        <InputField
                          type="text"
                          props={{ ...register("church") }}
                          title="Please indicate your church organization"
                        />
                      )}
                    </>
                  )}
                  {errors.isAg && <Error error={errors.isAg.message} />}
                </InputCard>

                {/* MEMBERSHIP */}
                <InputCard tag="Membership Status">
                  <div className="my-2">
                    <p className="text-[14px] font-semibold">
                      What is your membership status in the Men&apos;s
                      Ministries?
                    </p>
                    <div className="my-1">
                      <input
                        type="radio"
                        value="Pastor"
                        {...register("membership")}
                      />
                      <label htmlFor="Pastor" className="px-1">
                        Minister (Pastor)
                      </label>
                    </div>

                    <div className="my-1">
                      <input
                        type="radio"
                        value="Non Pastoral (layPerson)"
                        {...register("membership")}
                      />
                      <label
                        htmlFor="Non Pastoral (layPerson)"
                        className="px-1"
                      >
                        Non Pastoral (LayPerson)
                      </label>
                    </div>

                    <div className="my-1">
                      <input
                        type="radio"
                        value="Non AG"
                        {...register("membership")}
                      />
                      <label htmlFor="Non AG" className="px-1">
                        Non AG (but wish to attend)
                      </label>
                    </div>
                  </div>
                  {errors.membership && (
                    <Error error={errors.membership.message} />
                  )}
                </InputCard>

                {/* ACCOMMODATION */}
                <InputCard tag="Accommodation">
                  <div className="my-2">
                    <p className="text-[14px] font-semibold">
                      What type of accommodation do you want?
                    </p>
                    <div
                      className="my-1"
                      onClick={() => {
                        setHotel(false);
                        setHostel(true);
                      }}
                    >
                      <input
                        type="radio"
                        value="Hostel"
                        {...register("accommodation.value")}
                      />
                      <label htmlFor="hostel" className="px-1">
                        Hostel
                      </label>
                    </div>
                    {hostel && (
                      <>
                        <div className="my-2">
                          <h3 className="font-semibold">Hostel Details:</h3>
                          <p>
                            Open Halls @ 7k only throughout the Convention
                            period include churches and hostels. Provision of
                            Electricity, Foam and pillow, security and
                            sanitation{" "}
                          </p>
                        </div>
                        <hr />
                        <div className="my-2">
                          <p className="underline">Payment for Accommodation</p>
                          <p>LOC Account Details</p>
                          <p className="font-medium">Archibong Ekong</p>
                          <p className="font-medium">Fidelity Bank</p>
                          <p className="font-medium">6230493752</p>
                        </div>
                      </>
                    )}

                    <div
                      className="my-1"
                      onClick={() => {
                        setHotel(true);
                        setHostel(false);
                      }}
                    >
                      <input
                        type="radio"
                        value="Hotel"
                        name="accommodation"
                        {...register("accommodation.value")}
                      />
                      <label htmlFor="hotel" className="px-1">
                        Hotel
                      </label>
                    </div>

                    {hotel && (
                      <>
                        <Controller
                          name="accommodation"
                          control={control}
                          className="my-2"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={hotelAccommodations}
                              value=""
                              placeholder="Select your Hotel of Choice"
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption);
                                setSelectedHotel(selectedOption);
                              }}
                            />
                          )}
                        />
                        {selectedHotel && (
                          <>
                            <div className="my-2">
                              <h3 className="font-semibold">
                                Selected Hotel Description:
                              </h3>
                              <p>{selectedHotel.description}</p>
                            </div>
                            <hr />
                            <div className="my-2">
                              <p className="underline">
                                Payment for Accommodation
                              </p>
                              <p>LOC Account Details</p>
                              <p className="font-medium">Archibong Ekong</p>
                              <p className="font-medium">Fidelity Bank</p>
                              <p className="font-medium">6230493752</p>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <div
                      className="my-1"
                      onClick={() => {
                        setHotel(false);
                        setHostel(false);
                      }}
                    >
                      <input
                        type="radio"
                        value="Personal Arrangement"
                        {...register("accommodation.value")}
                      />
                      <label htmlFor="Personal Arrangement" className="px-1">
                        Personal Arrangement
                      </label>
                    </div>
                  </div>
                  {errors.accommodation && (
                    <Error error={errors.accommodation.value.message} />
                  )}
                </InputCard>

                {/* REGISTRATION */}
                <InputCard tag="Registration">
                  <div className="my-2">
                    <p className="text-[14px] font-semibold">
                      What type of registration do you want?
                    </p>
                    <div
                      className="my-1"
                      onClick={() => {
                        setRegular(true);
                        setHotelReg(false);
                      }}
                    >
                      <input
                        type="radio"
                        id="regularReg"
                        value="Regular"
                        {...register("registration")}
                      />
                      <label htmlFor="regularReg" className="px-1">
                        Regular
                      </label>
                    </div>
                    {regular && (
                      <>
                        <div className="my-2">
                          <h3 className="font-semibold">Regular Package:</h3>
                          <p className="font-medium">Price: #5,000</p>
                          <p className="font-medium">
                            Content: Conference File Jacket
                          </p>
                        </div>
                        <hr />
                      </>
                    )}

                    <div
                      className="my-1"
                      onClick={() => {
                        setRegular(false);
                        setHotelReg(true);
                      }}
                    >
                      <input
                        type="radio"
                        id="hotelReg"
                        value="Hotel"
                        name="registration"
                        {...register("registration")}
                      />
                      <label htmlFor="hotelReg" className="px-1">
                        Hotel
                      </label>
                    </div>
                    {hotelReg && (
                      <>
                        <div className="my-2">
                          <h3 className="font-semibold">Hotel Package:</h3>
                          <p className="font-medium">Price: #50,000</p>
                          <p className="font-medium">
                            Content: Conference Souvenir Bag/Wears/Materials,
                            file etc
                          </p>
                        </div>
                        <hr />
                      </>
                    )}
                  </div>
                  {errors.registration && (
                    <Error error={errors.registration.message} />
                  )}
                </InputCard>
              </section>
            </section>

            <div className="my-4 flex flex-end justify-end">
              <button
                type="submit"
                className={`${
                  isValid
                    ? "bg-green-600 border-green-600 cursor-pointer"
                    : "bg-gray-600 border-gray-600 cursor-not-allowed"
                } border w-fit drop-shadow-md  rounded-[5px] p-4 text-white`}
              >
                {isSubmitting ? (
                  <FaSpinner color="white" className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </section>
      </section>
    </section>
  );
}

export default App;
