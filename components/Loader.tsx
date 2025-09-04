import React from 'react'
import { Spinner } from "@/components/ui/shadcn-io/spinner";
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner/>
    </div>
  );
}

export default Loader