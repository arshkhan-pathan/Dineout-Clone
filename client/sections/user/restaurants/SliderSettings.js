import { Box } from "@mui/material";

const arrowSx = {
  display: "block",
  background: "#ff645a",
  padding: 1,
  borderRadius: 1,
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    background: "red",
  },
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  const isDisabled = className.includes("slick-disabled");
  return (
    <Box
      className={className}
      sx={{
        ...style,
        ...arrowSx,
        right: "-40px",
        display: isDisabled ? "none" : "flex",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  const isDisabled = className.includes("slick-disabled");
  return (
    <Box
      className={className}
      sx={{
        ...style,
        ...arrowSx,
        left: "-40px",
        display: isDisabled ? "none" : "flex",
      }}
      onClick={onClick}
    />
  );
};

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

export { settings };
