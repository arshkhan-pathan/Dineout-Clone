import React from "react";
import AdminLayout from "@/layouts/admin";
import MangerAdminProfile from "@/components/MangerAdminProfile";
import withAuth from "@/utils/withAuth";
function profile() {
  return (
    <AdminLayout>
      <MangerAdminProfile />
    </AdminLayout>
  );
}

export default withAuth(profile, ["1"], "/admin");
