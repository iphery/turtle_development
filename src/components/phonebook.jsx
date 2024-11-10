import { FaGlasses, FaRegSave } from "react-icons/fa";
import { CommonInput } from "./input";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { AiOutlineSelect } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";
import Loader from "./common/Loader";
import { ButtonLoader, CommonLoader } from "./loader";
import { HiOutlineSearch } from "react-icons/hi";

export default function Phonebook({ onSelected }) {
  const [inputContact, setInputContact] = useState({ name: "", phone: "" });
  const [inputContactError, setInputContactError] = useState([false, false]);
  const [openForm, setOpenForm] = useState(false);
  const [listContact, setListContact] = useState([]);
  const [onDelete, setOnDelete] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchcontact`;
    const response = await axios.get(apiurl);
    if (response.status == 200) {
      const contacts = response.data["contacts"];
      console.log(contacts);
      setListContact(contacts);
      setFilteredList(contacts);
      generate_deletion(contacts);
    }
  };

  const generate_deletion = (data) => {
    let deletion = [];
    data.forEach((element) => {
      deletion.push(false);
    });

    setOnDelete(deletion);
  };

  const search_data = () => {
    const filterData = listContact.filter((item) => {
      const name =
        item["name"] &&
        item["name"].toLowerCase().includes(keyword.toLowerCase());

      const phone =
        item["phone"] &&
        item["phone"].toLowerCase().includes(keyword.toLowerCase());

      return name || phone;
    });
    setFilteredList(filterData);
    generate_deletion(filterData);
  };

  useEffect(() => {
    search_data();
  }, [keyword]);

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <div>
      <div className="mb-5 w-full sm:w-1/2">
        <CommonInput
          input={keyword}
          type={"text"}
          onInputChange={(val) => {
            setKeyword(val);
          }}
          onKeyChange={(event) => {}}
          placeholder={"Search"}
        >
          <HiOutlineSearch />
        </CommonInput>
      </div>

      <table className="w-full">
        <thead className="border">
          <tr className=" bg-strokedark text-white">
            <th className="p-1">Name</th>
            <th className="p-1">Phone</th>
            <th className="p-1">Option</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item, index) => {
            return (
              <tr key={index} className="group cursor-default border ">
                <td className="p-1">{item.name}</td>
                <td className="p-1">{item.phone}</td>
                <td className="p-1">
                  {onDelete[index] ? (
                    <div className="flex justify-center">
                      <CommonLoader />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div
                        className="mr-5 transform hover:scale-110 hover:text-success"
                        onClick={() => {
                          onSelected({
                            name: item["name"],
                            phone: item["phone"],
                          });
                        }}
                      >
                        <AiOutlineSelect className="h-5 w-5" />
                      </div>

                      <div
                        className="mr-5 transform hover:scale-110 hover:text-danger"
                        onClick={async () => {
                          const deletion = [...onDelete];
                          deletion[index] = true;

                          setOnDelete(deletion);

                          const apiurl = `${API_URL}/deletecontact`;
                          const response = await axios.post(apiurl, {
                            idContact: item["id_contact"],
                          });

                          if (response.status === 200) {
                            console.log("ok");
                            fetch_data();
                          }

                          const after = [...onDelete];
                          after[index] = false;
                          setOnDelete(after);
                        }}
                      >
                        <MdOutlineClear className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </td>
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
