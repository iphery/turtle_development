// pages/api/usb.js
import { NextResponse } from "next/server";

import { usb, getDeviceList } from "usb";

export async function GET() {
  try {
    const devices = getDeviceList();
  } catch (error) {
    console.log(error);
  }

  return Response.json({ a: "i" });
}
