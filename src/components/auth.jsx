"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/app/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import SignIn from "@/app/(auth)/signin/page";
import { useProvider } from "@/app/appcontext";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { PageLoader, PageLoader1 } from "./loader";
import { useRouter } from "next/navigation";
import NoVerify from "@/components/noverify";
import DefaultLayout from "./Layouts/DefaultLayout";

//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Your Supabase URL
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Your Supabase Anon Key

///export const supabase = createClient(supabaseUrl, supabaseAnonKey);
/*
const sign_up = async (e) => {
  e.preventDefault();

  const email = "ipthery@gmail.com";
  const password = "123456";
  const phone = "085163664599";
  const name = "Putu Hery";

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  

  if (error) {
    console.log("gagal");
  } else {
    const now = new Date();
    const { error: profileError } = await supabase.from("user_details").insert([
      {
        id: user.id, // Link to the auth user by their id
        name: name,
        phone: phone,
        created_at: now.toLocaleString(),
      },
    ]);

    if (error) {
      console.log("gagal");
    } else {
      console.log("berhasil");
    }
  }
    
};
*/
export default function UserAuth({ children }) {
  const [isLogin, setLogin] = useState(true);
  const { user } = useProvider();
  const [onLoad, setOnload] = useState(true);
  const router = useRouter();
  const [verify, setVerify] = useState(0);

  const fetch_user = async (uid) => {
    const apiUrl = `${API_URL}/loginaction`;
    const response = await axios.post(apiUrl, {
      uid: uid,
    });

    if (response.status == 200) {
      if (response.data["user"][0]["name"] === null) {
        setLogin(false);

        router.push("/");
      } else {
        localStorage.setItem("username", response.data["user"][0]["name"]);
        localStorage.setItem("userlevel", response.data["user"][0]["level"]);
        localStorage.setItem("useremail", response.data["user"][0]["email"]);
        setLogin(true);
      }

      setVerify(response.data["user"][0]["verify"]);
      setOnload(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user == null) {
        localStorage.setItem("userUid", "");

        setLogin(false);
        setOnload(false);
        router.push("/");
      } else {
        localStorage.setItem("userUid", user.uid);

        fetch_user(user.uid);
        console.log("ini dari auth");
        console.log(user.uid);
        //setLogin(true);
      }

      //fetch_user(user.uid);
    });

    return () => unsubscribe();
  }, []);

  if (onLoad) {
    //return <PageLoader1 />;
    return <DefaultLayout />;
  } else {
    if (!isLogin) {
      return <SignIn></SignIn>;
    } else {
      if (verify == "1") {
        return <div>{children}</div>;
      } else {
        return <NoVerify />;
      }
    }
  }
}
