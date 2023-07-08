import React from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.svg";
import youtube from "../assets/images/Youtube.png";
import facebook from "../assets/images/Facebook.png";
import twitter from "../assets/images/Twitter.png";
import insta from "../assets/images/Instagram.png";
import google from "../assets/images/Google.png";
import Image from "next/image";

const FooterStyle = styled.div`
  position: relative;
  padding-block: 1px;
  background: white;
  .container-heading-second {
    display: flex;
    flex-direction: column;
    align-items: left;
    row-gap: 18px;
    h3 {
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
      color: #ff645a;
    }
    div {
      width: 32px;
      height: 2px;
      background: #ff645a;
      margin-bottom: 10px;
    }
  }
  .footer-second-row {
    padding: 30px;
    width: 86%;
    margin: auto;
    display: flex;
    justify-content: space-around;
    .footerparent {
      display: flex;
      width: 240px;
      flex-direction: column;
      row-gap: 8px;
    }
    p {
      font-size: 14px;
      line-height: 20px;
      color: #797979;
      cursor: pointer;
    }
    p:hover {
      color: black;
    }
  }
  .container-heading-part {
    height: 48px;
  }
  .footer_end_div {
    height: 234px;
    background: white;
    text-align: center;
    .footerlogodiv {
      height: 32px;
      width: 96px;
      margin: auto;
      margin-top: 40px;
    }
    p {
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      color: #797979;
      margin: 10px;
      cursor: pointer;
    }
    .sociallinks {
      display: flex;
      gap: 10px;
      width: 300px;
      margin: auto;
      justify-content: center;
    }
  }
`;

export default function Footer() {
  return (
    <FooterStyle>
      <div className="footer_end_div">
        <div className="footerlogodiv">
          <Image src={logo} alt="" />
        </div>
        <p>Find the best Restaurants, Discounts, Deals, Offers</p>
        <p>Contact: +917043492728</p>
        <div className="sociallinks">
          <Image src={youtube} alt="" />
          <Image src={twitter} alt="" />
          <Image src={facebook} alt="" />
          <Image src={insta} alt="" />
          <Image src={google} alt="" />
        </div>
        <p>2023, Dineout.co All Rights Reserved</p>
      </div>
    </FooterStyle>
  );
}
