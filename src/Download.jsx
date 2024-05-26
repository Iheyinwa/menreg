import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
// import { useState } from "react";
import * as XLSX from "xlsx";

const Download = () => {
  // const [actualData, setActualData] = useState({
  // firstName: "",
  // otherName: "",
  // email: ""
  // })
  const handleDownload = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "userData"));
     const data = querySnapshot.docs.map((doc) => ({
       ...doc.data(), // Spread the userData object directly
     }));

     let Actualdata = data.map((data, index) => ({
        SerialNumber: index + 1,
        Surname: data.userData.surname,
        FirstName: data.userData.firstName,
        OtherName: data.userData.otherName,
        Email: data.userData.email,
        WhatsappNumber: data.userData.whatsappNumber,
        Gsm1: data.userData.gsm1,
        Gsm2: data.userData?.gsm2 || "none",
        AGMember: data.userData.isAg,
        AGDistrict: data.userData.AGDistrict || "none",
        Church: data.userData?.church || "none",
        Membership: data.userData.membership,
        Accommodation: data.userData.accommodation.value,
        Registration: data.userData.registration.value,
        RegistrationAmount: data.userData.registration.amount,
        Payment: data.userData.Payment

      
     }))
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(Actualdata);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "AG Registration Data");

      // Save to file
      XLSX.writeFile(workbook, "AG Registration Data.xlsx");
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleDownload}
      >
        Download Data
      </button>
    </div>
  );
};

export default Download;
