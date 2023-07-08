// packages
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
// css
import classes from "@/styles/Navbar.module.css";
//
import Login from "./LoginButton";
import { selectCurrentUser } from "@/store/slices/auth.js";
import Profile from "../../../components/profile";
import { useRouter } from "next/router";
import Select from "@/components/Select";
import { useState } from "react";
import {
  selectCurrentLocation,
  setLocation,
} from "@/store/slices/restaurantSlice";
import Notification from "@/components/Notification";
import { Box } from "@mui/material";
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
  const user = useSelector(selectCurrentUser);
  const [selectedValue, setSelectedValue] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelectChange = (selectedOption) => {
    //
    setSelectedValue(selectedOption);
    dispatch(setLocation(selectedOption));
  };
  const defaultValue = locations.find((option) => option.id === "Adajan");
  const storeValue = useSelector(selectCurrentLocation);
  return (
    <Box component="header" sx={{ background: "white" }} id="header">
      <div id="nav" className={classes.nav}>
        <div id="logo" className={classes.logo}>
          <Link legacyBehavior href="/">
            <a>
              <Image
                style={{ boxShadow: "none" }}
                src="https://res.cloudinary.com/dhe9hmzbn/image/upload/v1687778178/website-logo_q0q5yy.png"
                alt="dineout Logo"
                classes={classes.aimg}
                width={100}
                height={35}
              />
            </a>
          </Link>
        </div>
        <div id="city" className={classes.city}>
          <Select
            className={classes.cityselect}
            options={locations}
            placeholder="Please type a location"
            isMulti={false}
            styles={{ width: "100%" }}
            value={selectedValue || storeValue || defaultValue}
            onChange={handleSelectChange}
          />
        </div>

        <div id="con" className={classes.con}>
          <ul className={classes.ul}>
            <li className={classes.li}>
              <Link
                href=""
                className={
                  router.pathname == "/"
                    ? classes.navheadingActive
                    : classes.navheading
                }
              >
                Home
              </Link>
            </li>
            <li className={classes.li}>
              <Link href="/book-table" className={classes.navheading}>
                Book a Table
              </Link>
            </li>

            <li className={classes.li}>
              <Link href="/restaurants" className={classes.navheading}>
                Restaurants
              </Link>
            </li>
          </ul>
        </div>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          {user && <Notification />}
          {!user ? <Login /> : <Profile />}
        </Box>
      </div>
    </Box>
  );
};

export default Navbar;
