import React from "react";
import dynamic from "next/dynamic";

const EditableTabs = dynamic(() => import("@screens/Publication/ui"), {
  ssr: false,
});

const PublicationPage = () => {
  return (
    <div>
      <EditableTabs />
    </div>
  );
};

export default PublicationPage;
