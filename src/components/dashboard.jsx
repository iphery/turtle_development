"use client";
import { useMediaQuery } from "react-responsive";
import UserAuth from "./auth";
import DefaultLayout from "./Layouts/DefaultLayout";
import CardDataStats from "./CardDataStats";
import { BsUpcScan } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRScanner1 from "./qrscanner2";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { NotifyError } from "@/utils/notify";

export default function Dashboard() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [scanProduct, setScanProduct] = useState("");

  const find_product = async () => {
    console.log("prodse cari");
    const apiurl = `${API_URL}/findproduct`;
    const response = await axios.post(apiurl, { barcode: scanProduct });
    if (response.status === 200) {
      console.log(response.data);
      const error = response.data["error"];
      if (error == 1) {
        NotifyError("Product not found");
        setScanProduct("");
      } else {
        const id = response.data["id_product"];
        router.push(`/product/${id}`);
      }
    }
  };

  useEffect(() => {
    if (scanProduct != "") {
      console.log("cari server");
      find_product();
    }
  }, [scanProduct]);

  return (
    <>
      {!showScanner ? (
        <UserAuth>
          <DefaultLayout>
            <div>
              <div
                onClick={() => {
                  setShowScanner(true);
                }}
              >
                <CardDataStats total="Find Product">
                  <BsUpcScan className="w-8" />
                </CardDataStats>
              </div>
            </div>
          </DefaultLayout>
        </UserAuth>
      ) : (
        <QRScanner1
          onScanResult={(res) => {
            setShowScanner(false);
            setScanProduct(res);
          }}
        ></QRScanner1>
      )}
    </>
  );
}
