import React from "react";
import RestaurantLayout from "@/layouts/restaurant";
import MangerAdminProfile from "@/components/MangerAdminProfile";
import withAuth from "@/utils/withAuth";
function Profile() {
  return (
    <>
      <RestaurantLayout>
        <MangerAdminProfile></MangerAdminProfile>
      </RestaurantLayout>
    </>
  );
}

export default withAuth(Profile, [2], "/restaurant/login");
