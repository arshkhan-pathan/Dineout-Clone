import Head from "next/head";
import Navbar from "./navbar";
import Banner from "@/sections/user/home/Banner";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";

const UserLayout = ({ title, keywords, description, children }) => {
  const router = useRouter();

  return (
    <div className="app">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>

      <Navbar />
      {router.pathname === "/" && <Banner />}
      <main>{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default UserLayout;

UserLayout.defaultProps = {
  title: "Dineout | Find the Best Restaurnats To Dine",
  description: "Find the latest restaurants",
  keywords: "Dineout, Restaunrants",
};
