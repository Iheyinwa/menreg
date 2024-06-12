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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// name schema
const schema = yup.object().shape({
  surname: yup.string().required("Your Surname is required"),
  firstName: yup.string().required("Your First Name is required"),
  otherName: yup.string(),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Your Email is required"),
  gsm1: yup.string().required("Your GSM1 (Whatsapp Number) is required"),
  gsm2: yup.string().nullable(),
  membership: yup.string().required("Please choose your membership status"),
  accommodation: yup.object().shape({
    value: yup.string().required("Please select your preferred accommodation"),
  }),
  registration: yup
    .string()
    .required("Please select your registration package"),
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
  });

  // const [count, setCount ] = useState(0)
  // const [names, setNames ] = useState(0)
  const [isMinister, setIsMinister] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isNonAG, setIsNonAG] = useState(false);
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
    totalAmount += 15000;
  }
  console.log("Original data:", data);

  // Extract the value from the AGChapter select
  const agDistrictValue = data.AGDistrict?.value || "none";
  const accommodationValue = {
    value: data.accommodation?.value,
  };
  const registrationValue = {
    value: data.registration,
    amount: totalAmount
  };

  // Create a new data object with only the necessary values
  

  setIsSubmitting(true);

  const cleanedData = {
    ...data,
    AGDistrict: agDistrictValue,
    accommodation: accommodationValue,
    registration: registrationValue,
    Payment: "Successful",
  };

  console.log(cleanedData)

  const paystackKey = import.meta.env.VITE_PUBLIC_KEY
  const paystack = new PaystackPop();
  paystack.newTransaction({
    key: paystackKey,
    email: data.email,
    amount: totalAmount * 100,

    onSuccess: async () => {
      try {
        const userDataRef = await addDoc(collection(db, "userData"), {
          userData: cleanedData,
        });
        console.log("User Data written with ID: ", userDataRef.id);
        toast.success("Payment was successful and your form was submitted!");
        reset(); // Reset the form only after successful submission
      } catch (e) {
        console.error("Error submitting information: ", e);
        toast.error("Error submitting your data after payment.");
      } finally {
        setIsSubmitting(false);
      }
    },
    onCancel: () => {
      setIsSubmitting(false);
      toast.error("Payment was canceled and your form was not submitted!");
    },
  });
  reset();
  };



  return (
    <section>
      <ToastContainer />
      <section className="flex justify-center items-center">
        <section className="w-[80%] md:w-[60vw]">
          <h1 className="text-center text-2xl font-bold my-2">
            2024 NATIONAL MEN&apos;S CONVENTION
          </h1>
          <p className="font-bold text-center my-2 text-lg">
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
                <InputCard tag="Names">
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
                    title="Other(s) Name (optional):  "
                    props={{ ...register("otherName") }}
                  />
                  {errors.otherName && (
                    <Error error={errors.otherName.message} />
                  )}
                  <InputField
                    type="email"
                    title="Email: "
                    props={{ ...register("email") }}
                    note="In absence of an email, input agmensministries@gmail.com"
                  />

                  {errors.email && <Error error={errors.email.message} />}
                </InputCard>

                {/* CONTACTS */}
                <InputCard tag="Contacts">
                  <InputField
                    type="tel"
                    title="GSM1 (Whatsapp Number): "
                    props={{ ...register("gsm1") }}
                    note="In absence of a whatsapp number, input 08133164446"
                  />
                  {errors.gsm1 && <Error error={errors.gsm1.message} />}
                  <InputField
                    type="tel"
                    title="GSM2 (optional): "
                    props={{ ...register("gsm2") }}
                  />
                  {errors.gsm2 && <Error error={errors.gsm2.message} />}
                </InputCard>

                {/* MEMBERSHIP */}
                <InputCard tag="Membership Status">
                  <div className="my-2">
                    <p className="text-[15px] font-semibold">
                      What is your membership status in the Men&apos;s
                      Ministries?
                    </p>
                    <div className="my-1">
                      <input
                        type="radio"
                        value="AG Member and Minister"
                        {...register("membership")}
                        onClick={() => {
                          setIsMinister(true);
                          setIsMember(false);
                          setIsNonAG(false);
                        }}
                      />
                      <label htmlFor="AG Member and Minister" className="px-2 text-[15px]">
                        AG Member and Minister
                      </label>
                    </div>
                    {isMinister && (
                      <>
                        <Controller
                          name="AGDistrict"
                          className="my-2"
                          defaultValue={""}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={districts}
                              placeholder="Select your AG District"
                            />
                          )}
                        />
                      </>
                    )}
                    <div className="my-1">
                      <input
                        type="radio"
                        value="AG Member"
                        {...register("membership")}
                        onClick={() => {
                          setIsMinister(false);
                          setIsMember(true);
                          setIsNonAG(false);
                        }}
                      />
                      <label htmlFor="AG Member" className="px-2 text-[15px]">
                        AG Member
                      </label>
                    </div>
                    {isMember && (
                      <>
                        <Controller
                          name="AGDistrict"
                          className="my-2"
                          control={control}
                          defaultValue={""}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={districts}
                              placeholder="Select your AG District"
                            />
                          )}
                        />
                      </>
                    )}
                    <div className="my-1">
                      <input
                        type="radio"
                        value="Non AG"
                        {...register("membership")}
                        onClick={() => {
                          setIsMinister(false);
                          setIsMember(false);
                          setIsNonAG(true);
                        }}
                      />
                      <label htmlFor="Non AG" className="px-2 text-[15px]">
                        Non AG (but wish to attend)
                      </label>
                    </div>
                    {isNonAG && (
                      <>
                        <InputField
                          type="text"
                          props={{ ...register("church") }}
                          title="Please indicate your church organization"
                        />
                      </>
                    )}
                  </div>
                  {errors.membership && (
                    <Error error={errors.membership.message} />
                  )}
                </InputCard>

                {/* ACCOMMODATION */}
                <InputCard tag="Accommodation">
                  <div className="my-2">
                    <p className="text-[15px] font-semibold">
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
                      <label htmlFor="hostel" className="px-2 text-[15px]">
                        Hostel
                      </label>
                    </div>
                    {hostel && (
                      <>
                        <div className="my-2">
                          <h3 className="font-normal italic text-[14px]">
                            Hostel Details:
                          </h3>
                          <p className="italic text-[14px]">
                            Open Halls @ ₦7,000 only throughout the Convention
                            period include churches and hostels. Provision of
                            Electricity, Foam and pillow, security and
                            sanitation.
                          </p>
                        </div>
                        <hr />
                        <div className="my-2">
                          <p className="underline italic text-[14px]">
                            Payment for Accommodation
                          </p>
                          <p className="italic text-[14px]">LOC Account Details</p>
                          <p className="font-normal italic text-[14px]">Archibong Ekong</p>
                          <p className="font-normal italic text-[14px]">Fidelity Bank</p>
                          <p className="font-normal italic text-[14px]">6230493752</p>
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
                      <label htmlFor="hotel" className="px-2 text-[15px]">
                        Hotel
                      </label>
                    </div>

                    {hotel && (
                      <>
                        <Controller
                          name="accommodation"
                          control={control}
                          className="my-2"
                          defaultValue={""}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={hotelAccommodations}
                              value={selectedHotel}
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
                              <h3 className="font-normal italic text-[14px]">
                                Selected Hotel Description:
                              </h3>
                              <p className="italic text-[14px]">
                                {selectedHotel.description}
                              </p>
                            </div>
                            <hr />
                            <div className="my-2">
                              <p className="underline italic text-[14px]">
                                Payment for Accommodation
                              </p>
                              <p className="italic text-[14px]">LOC Account Details</p>
                              <p className="font-normal italic text-[14px]">
                                Archibong Ekong
                              </p>
                              <p className="font-normal italic text-[14px]">
                                Fidelity Bank
                              </p>
                              <p className="font-normal italic text-[14px]">6230493752</p>
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
                      <label htmlFor="Personal Arrangement" className="px-2 text-[15px]">
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
                    <p className="text-[15px] font-semibold">
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
                      <label htmlFor="regularReg" className="px-2 text-[15px]">
                        Regular
                      </label>
                    </div>
                    {regular && (
                      <>
                        <div className="my-2">
                          <h3 className="font-normal italic text-[14px]">
                            Regular Package:
                          </h3>
                          <p className="font-normal italic text-[14px]">Price: ₦5,000</p>
                          <p className="font-normal italic text-[14px]">
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
                        id="executiveReg"
                        value="Executive"
                        name="registration"
                        {...register("registration")}
                      />
                      <label htmlFor="Executive" className="px-2 text-[15px]">
                        Executive
                      </label>
                    </div>
                    {hotelReg && (
                      <>
                        <div className="my-2">
                          <h3 className="font-normal italic text-[14px]">
                            Executive Package:
                          </h3>
                          <p className="font-normal italic text-[14px]">Price: ₦15,000</p>
                          <p className="font-normal italic text-[14px]">
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
