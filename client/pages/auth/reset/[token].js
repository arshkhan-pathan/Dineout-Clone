// packages
import { useRouter } from "next/router";
import ForgotPassword from "@/components/ForgotPassword";
import Head from "next/head";
// layouts
const ResetPassword = () => {
  const router = useRouter();
  const token = router.query.token;
  let tokens = token?.split("&");

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <ForgotPassword tokens={tokens}></ForgotPassword>
    </>
  );
};

export default ResetPassword;
