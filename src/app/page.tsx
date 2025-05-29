"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Auth from "@/components/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase-config";
import UserAuth from "@/components/auth";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import Dashboard from "@/components/dashboard";
import { useEffect } from "react";
import { useProvider } from "./appcontext";

export default function Home() {
  const fetch_data_user = async () => {
    const apiUrl = `${API_URL}/api/actionlogin`;
    const response = await axios.post(apiUrl, {
      uid: "aaa",
    });

    if (response.status == 200) {
      console.log(response);
    }
  };

  return <div>This application is under maintenance</div>;
  return <Dashboard />;
}
