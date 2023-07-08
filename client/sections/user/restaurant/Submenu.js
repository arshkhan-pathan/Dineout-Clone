import styled from "styled-components";
import { Link } from "react-scroll";

const Wrapper = styled.div`
  display: flex;

  div {
    padding: 14px 28px;
    color: #333333;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;
  }
`;

const SubMenu = () => {
  return (
    <>
      <Wrapper>
        <Link
          to="Overview"
          spy={true}
          smooth={true}
          offset={-20}
          duration={500}
        >
          <div>Overview</div>
        </Link>
        <Link to="AboutUs" spy={true} smooth={true} offset={-20} duration={500}>
          <div>About Us</div>
        </Link>
        <Link
          to="WriteReview"
          spy={true}
          smooth={true}
          offset={-20}
          duration={500}
        >
          <div>Write Review</div>
        </Link>
        <Link to="Reviews" spy={true} smooth={true} offset={-20} duration={500}>
          <div>Reviews</div>
        </Link>
      </Wrapper>
    </>
  );
};

export default SubMenu;
