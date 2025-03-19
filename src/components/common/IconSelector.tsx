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
import { ReactElement } from "react";

interface IconSelectorProps {
  selected?: ReactElement;
  onSelect: (icon: ReactElement) => void;
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
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
      <div className="grid grid-cols-4 gap-3">
        {iconList.map((icon) => {
          const isSelected =
            selected?.type === icon.component.type; // Comparación por tipo de componente

          return (
            <button
              key={icon.name}
              onClick={() => onSelect(icon.component)}
              className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-primario text-white border-2 border-blue-300 shadow-md"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-200 focus:outline-3 focus:outline-offset-2 focus:outline-primario active:bg-primario active:text-white hover:shadow-md"
              }`}
            >
              {icon.component}
            </button>
          );
        })}
      </div>
    </div>
  );
};
