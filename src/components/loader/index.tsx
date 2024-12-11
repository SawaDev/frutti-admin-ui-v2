import { SyncLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <SyncLoader color="rgb(96 165 250)" />
    </div>
  );
};

export default Loader;
