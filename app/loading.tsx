import Image from "next/image";

import loader from "@/assets/loader.gif";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Image src={loader} alt="loading" height={150} width={150} />
    </div>
  );
};

export default Loading;




