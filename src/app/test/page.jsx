"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const USBDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const check_usb = async () => {
    /*
    try {
      const response = await axios.get("/api/usb");
      //const data = await response.json();
      console.log(response);
      if (response.status == 200) {
        console.log(response);
      }
    } catch (error) {
      //console.error("Error fetching USB devices:", error);
    } finally {
      //setLoading(false);
    }
      */
  };

  const check = async () => {
    /*
    const device = await navigator.usb.requestDevice({
      filters: [], // Empty filters allow listing all available devices
    });

    console.log("kkk", device);
    */
  };

  /*
  if (loading) {
    return <div>Loading USB devices...</div>;
  }
    */

  return (
    <div>
      {/**  <button onClick={check_usb}>check</button>
      <h1>USB Devices</h1>
      {devices.length === 0 ? (
        <p>No USB devices found.</p>
      ) : (
        <ul>
          {devices.map((device, index) => (
            <li key={index}>
              <h3>Vendor ID: {device.vendorId}</h3>
              <h3>Product ID: {device.productId}</h3>
              <h4>Interfaces:</h4>
              <ul>
                {device.interfaces.map((intf, intfIndex) => (
                  <li key={intfIndex}>
                    <p>Interface Number: {intf.interfaceNumber}</p>
                    <h5>Endpoints:</h5>
                    <ul>
                      {intf.endpoints.map((endpoint, endpointIndex) => (
                        <li key={endpointIndex}>
                          <p>Endpoint Address: {endpoint.endpointAddress}</p>
                          <p>Direction: {endpoint.direction}</p>
                          <p>Type: {endpoint.type}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}*/}
    </div>
  );
};

export default USBDevices;
