import React from "react";
import ProfileScreen from "@screens/Profile";
import { withAuthGuard } from "@shared/HOCS/withAuthGuard";

const ProfilePage = () => {
  return <ProfileScreen />;
};

export default withAuthGuard(ProfilePage);
