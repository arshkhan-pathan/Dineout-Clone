import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";

const loginRedirect = (WrappedComponent, link) => {
  return () => {
    const user = useSelector(selectCurrentUser);
    const router = useRouter();

    if (user) {
      router.replace(link);
      return null;
    }

    return <WrappedComponent />;
  };
};

export default loginRedirect;
