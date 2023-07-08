// packages
import {
  Box,
  Card as MuiCard,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";

const MAX_WORDS = 5;
const RenderTitle = ({ title }) => {
  const words = title.split(" ");
  if (words.length <= MAX_WORDS) {
    return (
      <Typography component="h4" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
    );
  } else {
    const truncatedTitle = words.slice(0, MAX_WORDS).join(" ");

    return (
      <Tooltip title={title} placement="bottom-end" arrow>
        <Typography component="h4" sx={{ fontWeight: "bold" }}>
          {truncatedTitle + "..."}
        </Typography>
      </Tooltip>
    );
  }
};

const Card = ({
  id,
  name,
  locality,
  ratings,
  images,
  city,
  showExtra,
  avg_cost,
  cuisines,
}) => {
  const router = useRouter();
  const joinedCuisines = cuisines.slice(0, 2).map((tag) => tag.name).join(", ");

  return (
    <MuiCard
      key={id}
      elevation={0}
      sx={{
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow:
            "0px 1px 3px rgba(0,0,0,0.2), 0px 2px 4px rgba(0,0,0,0.14), 0px 1px 8px rgba(0,0,0,0.12)",
        },
      }}
      onClick={() => router.push(`/restaurants/${id}`)}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={images[0]?.image}
          alt="green iguana"
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <RenderTitle title={name} />
              <Typography sx={{ fontSize: 12 }}>
                {locality} || {city}
              </Typography>
              {showExtra && (
                <>
                  <Typography sx={{ fontSize: 12 }}>
                    ₹ {avg_cost} for 2 (approx)
                  </Typography>
                  <Typography sx={{ fontSize: 12 }}>
                    {joinedCuisines}
                  </Typography>
                </>
              )}
            </Box>
            <Chip
              label={ratings}
              color="success"
              sx={{ borderRadius: 1, height: 25 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </MuiCard>
  );
};

export default Card;
