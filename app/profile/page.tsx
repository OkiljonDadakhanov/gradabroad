import React from "react";
import { ProfileSection } from "@/components/profile/profile-section";
import { AppLayout } from "@/components/layout/app-layout";

function Profile() {
  return (
    <div>
      <AppLayout>
        <ProfileSection />
      </AppLayout>
    </div>
  );
}

export default Profile;
