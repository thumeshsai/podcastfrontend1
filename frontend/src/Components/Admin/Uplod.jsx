import { useState } from "react";
import FileUpload from "./FileUpload";

function Uplod() {
  const openPopup = () => {
    setPopupVisible(true);
  };
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <div>
      <button
        className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 m-2 w-full md:w-64"
        type="button"
        onClick={openPopup}
      >
        Upload +
      </button>
      <FileUpload
        isPopupVisible={isPopupVisible}
        setPopupVisible={setPopupVisible}
      />
    </div>
  );
}
export default Uplod;
