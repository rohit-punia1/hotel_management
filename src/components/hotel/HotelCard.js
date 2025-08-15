import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
} from "@mui/material";

export default function HotelCardLandscape({ hotel, onViewDetails }) {
  const hotelImage =
    hotel?.hotelImageLinks?.find((img) => img.imageType === "General view")
      ?.imageLink ||
    hotel?.hotelImageLinks?.[0]?.imageLink ||
    "/placeholder.jpg";

  const ratingValue = Number(hotel?.rating?.split(" ")[0]) || 0;

  // Find lowest price
  const lowestPrice = hotel?.roomResponses.map(
    (room) => room?.rateKeyResponses?.totalPrice
  );
  const minPrice = lowestPrice?.length ? Math.min(...lowestPrice) : null;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on desktop
        width: "100%",
        
        height: 260,
      }}
    >
      {/* Left: Image */}
      <CardMedia
        component="img"
        sx={{
          width: { xs: "100%", sm: 250 },
          height: "100%",
          objectFit: "cover",
        }}
        image={hotelImage}
        alt={hotel?.hotelName || "Hotel"}
      />

      {/* Right: Content */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {hotel?.hotelName || hotel?.name}
        </Typography>

        <Rating value={ratingValue} precision={0.5} readOnly size="small" />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {hotel?.address}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
          {hotel.facilityResponses?.slice(0, 5).map((a, i) => (
            <Chip key={i} label={a.name} size="small" />
          ))}
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {minPrice && (
          <Typography variant="h6" sx={{ mt: 1, color: "primary.main" }}>
            Starting from ₹{minPrice.toFixed(2)}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onViewDetails(hotel)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
