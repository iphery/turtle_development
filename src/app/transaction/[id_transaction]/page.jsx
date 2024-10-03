"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserAuth from "@/components/auth";
import { PageCard } from "@/components/card";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page({ params }) {
  const [trans, setTrans] = useState({});
  const [detail, setDetail] = useState([]);
  const fetch_data = async () => {
    const apiurl = `${API_URL}/fetchdetailtransaction`;
    const response = await axios.post(apiurl, {
      idTransaction: params.id_transaction,
    });
    if (response.status == 200) {
      console.log(response.data);
      const newtrans = response.data["transactions"][0];
      const newdetail = response.data["details"];
      setTrans(newtrans);
      setDetail(newdetail);
      console.log(newtrans);
      console.log(newdetail);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <UserAuth>
      <DefaultLayout>
        <div className="text-xl font-bold">Transaction Detail</div>
        <PageCard>
          <div className="mb-2 sm:mb-0 sm:flex sm:flex-row">
            <div className="w-full sm:w-1/2 ">
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">No Transaction</div>
                <div className="w-full">{trans.id_transaction}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">Date</div>
                <div className="w-full">{trans.date}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">Type</div>
                <div className="w-full">{trans.type}</div>
              </div>
              <div className="mb-2 sm:flex sm:justify-evenly">
                <div className="w-full">
                  {trans.type == "IN" ? "From" : "To"}
                </div>
                <div className="w-full">{trans.subject}</div>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              {trans.type == "OUT" ? (
                <div className="mb-2 sm:flex sm:justify-evenly">
                  <div className="w-full">Note</div>
                  <div className="w-full">{trans.note}</div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </PageCard>
        <div className="mb-5"></div>
        <PageCard>
          <div className="p-2">
            <table className="w-full">
              <thead>
                <tr className="bg-strokedark text-white">
                  <th>No</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {detail.length > 0 &&
                  detail.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-1 text-center">{index + 1}</td>
                        <td className="p-1 ">{item["description"]}</td>
                        <td className="p-1 text-center">{item["quantity"]}</td>
                        <td className="p-1 text-center">{item["unit"]}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </PageCard>
        <div className="mb-5"></div>
        <PageCard>
          <div className="sm:flex sm:justify-evenly">
            <div className="w-full">
              <div className="flex justify-start">
                <div>Signed at :</div>
                <div className="ml-3">aa</div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-start">
                <div>Signature :</div>
                <div className="ml-3">aa</div>
              </div>
            </div>
          </div>
        </PageCard>
      </DefaultLayout>
    </UserAuth>
  );
}
