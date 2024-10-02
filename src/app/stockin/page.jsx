"use client";
import UserAuth from "@/components/auth";
import { CommonInput } from "@/components/input";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { API_URL } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";

export default function page() {
  return (
    <UserAuth>
      <DefaultLayout></DefaultLayout>
    </UserAuth>
  );
}
