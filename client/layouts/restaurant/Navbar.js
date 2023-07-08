// css
import classes from "@/styles/NavbarSecondary.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/components/Select";
import { useState } from "react";
import { setLocation } from "@/store/slices/restaurantSlice";
import { selectCurrentUser } from "@/store/slices/auth.js";
import { selectCurrentLocation } from "@/store/slices/restaurantSlice";
import Image from "next/image";

const locations = [
  {
    id: "Adajan",
    name: "Adajan",
  },
  {
    id: "Vesu",
    name: "Vesu",
  },
  {
    id: "Varacha",
    name: "Varacha",
  },
];

const Navbar = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const search = searchQuery;

    router.push(`/restaurants/search?q=${encodeURIComponent(search)}`);
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    dispatch(setLocation(selectedOption));
  };

  const getRedirectLink = () => {
    const role = user?.role;
    if (role == 1) {
      router.push("/admin");
    } else if (role == 2) {
      router.push("/restaurant");
    } else if (role == 3) {
      router.push("/profile");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const selectedLocationValue = useSelector(selectCurrentLocation);

  return (
    <div className={classes.body}>
      <div className={classes.inner_page_header}>
        <div className={classes.header_section1}>
          <div className={classes.logo_section}>
            <Link href="/" legacyBehavior>
              <Image
                className={classes.pageLogo}
                src="https://res.cloudinary.com/dhe9hmzbn/image/upload/v1687778178/website-logo_q0q5yy.png"
                alt=""
                width={100}
                height={35}
              />
            </Link>
          </div>

          <div className={classes.location_section}>
            <i className="fas fa-map-marker-alt"></i>

            <Select
              options={locations}
              placeholder="Please type a location"
              isMulti={false}
              styles={{ width: "100%" }}
              value={selectedValue || selectedLocationValue}
              onChange={handleSelectChange}
            />
          </div>
          <div className={classes.search_section}>
            <i className={classes.fa_search}></i>
            <input
              type="text"
              onChange={handleSearchChange}
              placeholder="Search restaurants, Offers, Deals or Events... "
            />
          </div>
          <div className={classes.search_button}>
            <button onClick={handleSearchSubmit}>Search</button>
          </div>
        </div>
        <div className={classes.horizontal_line}></div>
        <div className={classes.header_section2}>
          <div className={classes.list}>
            <Link href="/" legacyBehavior>
              <p className={classes.p}>Home</p>
            </Link>
            <Link href="/book-table" legacyBehavior>
              <p className={classes.p}>Book a Table</p>
            </Link>
            <Link href="/restaurants" legacyBehavior>
              <p
                className={
                  router.pathname == "/restaurants"
                    ? classes.pActive
                    : classes.p
                }
              >
                Restaurants
              </p>
            </Link>
            {!user && (
              <Link href="/restaurant/login" legacyBehavior>
                <p
                  className={
                    router.pathname == "/restaurant/login"
                      ? classes.pActive
                      : classes.p
                  }
                >
                  Restaurant Login
                </p>
              </Link>
            )}

            {user && (
              <p
                onClick={getRedirectLink}
                className={
                  router.pathname == "/restaurant/login"
                    ? classes.pActive
                    : classes.p
                }
              >
                Profile
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
