import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";

const withAuth = (WrappedComponent, allowedRoles, link) => {
  return (props) => {
    const user = useSelector(selectCurrentUser);

    const router = useRouter();

    if (!user) {
      router.push(link);
      return null;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user?.role)
    ) {
      router.push("/forbidden");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
