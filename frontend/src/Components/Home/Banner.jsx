/* eslint-disable react/prop-types */
const Banner = ({onOpen}) => {
  return (
    <div className="h-screen flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center text-center md:text-left">
          <div className="w-full md:w-1/2 lg:w-4/12 px-4">
            <h1 className="mb-3 text-3xl md:text-4xl lg:text-5xl font-bold ml-5">
              Tell Your Story to the World
            </h1>
            <button
              onClick={() => onOpen("Admin")}
              className="border rounded-lg p-3 mt-3 mb-2 bg-blue-500 text-white hover:bg-gray-500 ml-5"
            >
              Become a Creator
            </button>
          </div>
          <div className="w-full md:w-1/2 lg:w-8/12 px-4">
            <img
              src="https://preview.colorlib.com/theme/podcast/images/1x/asset-1.png"
              alt="Image"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
