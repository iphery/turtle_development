import React from "react";
import {
  BsFillBoxFill,
  BsFillHeartFill,
  BsFillStarFill,
  BsFillFuelPumpFill,
} from "react-icons/bs";
import { FaToolbox } from "react-icons/fa6";
import { RiDashboardFill } from "react-icons/ri";
import { FaTools } from "react-icons/fa";

const IconRenderer = ({ iconName }) => {
  let IconComponent = null;

  // Use if-else statements to map iconName to specific icons
  if (iconName === "dashboard") {
    IconComponent = RiDashboardFill;
  } else if (iconName === "product") {
    IconComponent = BsFillBoxFill;
  } else if (iconName === "tool") {
    IconComponent = FaTools;
  } else if (iconName === "fuel") {
    IconComponent = BsFillFuelPumpFill;
  }

  // If no matching icon is found
  if (!IconComponent) {
    return <div>Icon not found</div>;
  }

  return <IconComponent size={18} />;
};

export default IconRenderer;
