import { FaGlasses, FaRegSave } from "react-icons/fa";
import { CommonInput } from "./input";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils/constant";
import axios from "axios";

export default function Phonebook({ onSelected }) {
  const [inputContact, setInputContact] = useState({ name: "", phone: "" });
  const [inputContactError, setInputContactError] = useState([false, false]);
  const [openForm, setOpenForm] = useState(false);
  const [listContact, setListContact] = useState([]);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchcontact`;
    const response = await axios.get(apiurl);
    if (response.status == 200) {
      const contacts = response.data["contacts"];
      console.log(contacts);
      setListContact(contacts);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <div>
      <table className="w-full">
        <tbody>
          {listContact.map((item, index) => {
            return (
              <tr
                key={index}
                className="group cursor-default hover:bg-bodydark hover:text-white"
                onClick={() => {
                  onSelected({ name: item["name"], phone: item["phone"] });
                }}
              >
                <td>{item.name}</td>
                <td>{item.phone}</td>
              </tr>
            );
          })}
          {openForm ? (
            <tr className="pt-2">
              <td className="align-top">
                <CommonInput
                  input={inputContact.name}
                  error={inputContactError[0]}
                  errorMessage={"Required"}
                  onChg={() => {
                    const newdata = [...inputContactError];
                    newdata[0] = false;
                    setInputContactError(newdata);
                  }}
                  onInputChange={(val) => {
                    setInputContact((prev) => ({ ...prev, name: val }));
                  }}
                ></CommonInput>
              </td>
              <td className="align-top">
                <CommonInput
                  input={inputContact.phone}
                  error={inputContactError[1]}
                  type={"number"}
                  errorMessage={"Required"}
                  onInputChange={(val) => {
                    setInputContact((prev) => ({ ...prev, phone: val }));
                  }}
                  onChg={() => {
                    const newdata = [...inputContactError];
                    newdata[1] = false;
                    setInputContactError(newdata);
                  }}
                ></CommonInput>
              </td>
              <td className="align-top">
                <div
                  onClick={async () => {
                    console.log(inputContact);
                    const error = [...inputContactError];
                    let localError = [false, false];
                    if (inputContact.name == "") {
                      error[0] = true;
                      setInputContactError(error);
                      localError[0] = true;
                    } else {
                      localError[0] = false;
                    }
                    if (inputContact.phone == "") {
                      error[1] = true;
                      setInputContactError(error);
                      localError[1] = true;
                    } else {
                      localError[1] = false;
                    }

                    if (!localError.includes(true)) {
                      console.log("good to go");
                      const apiurl = `${API_URL}/createcontact`;
                      const response = await axios.post(apiurl, {
                        data: inputContact,
                      });

                      if (response.status == 200) {
                        fetch_data();
                      }
                    }

                    setOpenForm(false);
                  }}
                >
                  <FaRegSave className="h-7 w-7" />
                </div>
              </td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </table>
      {openForm ? (
        <></>
      ) : (
        <div
          className="group flex cursor-default justify-end p-2 hover:text-strokedark"
          onClick={() => {
            setOpenForm(true);
            setInputContact((prev) => ({ name: "", phone: "" }));
          }}
        >
          + Add Contact
        </div>
      )}
    </div>
  );
}
