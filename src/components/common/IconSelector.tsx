import { useState } from "react";
import {
  FiSmile,
  FiStar,
  FiHeart,
  FiCode,
  FiCamera,
  FiZap,
  FiCloud,
  FiSun,
} from "react-icons/fi";

interface IconSelectorProps {
  selected?: React.ReactNode;
  onSelect: (icon: React.ReactNode) => void;
}

export const IconSelector = ({ selected, onSelect }: IconSelectorProps) => {
  const iconList = [
    { name: "FiSmile", component: <FiSmile className="w-6 h-6" /> },
    { name: "FiStar", component: <FiStar className="w-6 h-6" /> },
    { name: "FiHeart", component: <FiHeart className="w-6 h-6" /> },
    { name: "FiCode", component: <FiCode className="w-6 h-6" /> },
    { name: "FiCamera", component: <FiCamera className="w-6 h-6" /> },
    { name: "FiZap", component: <FiZap className="w-6 h-6" /> },
    { name: "FiCloud", component: <FiCloud className="w-6 h-6" /> },
    { name: "FiSun", component: <FiSun className="w-6 h-6" /> },
  ];

  return (
    <div className="border rounded-lg p-2">
      <div className="grid grid-cols-4 gap-2">
        {iconList.map((icon, i) => (
          <button
            key={i}
            onClick={() => onSelect(icon.component)}
            className={`p-2 rounded flex items-center justify-center ${
              selected === icon.component
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {icon.component}
          </button>
        ))}
      </div>
    </div>
  );
};