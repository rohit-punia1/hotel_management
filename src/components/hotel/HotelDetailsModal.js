import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Chip,
  ImageList,
  ImageListItem,
} from "@mui/material";
import HotelImagesCarousel from "./HotelImageCrasoul";
import RoomList from "./Room/RoomList";
import { ClosedCaption, PanelTopClose, X } from "lucide-react";

export default function HotelDetailsModal({ open, onClose, hotel }) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth >
      <div className="flex justify-between items-center">
        <DialogTitle>{hotel.hotelName}</DialogTitle>
        <X className="h-5 w-5 mx-5" onClick={onClose} />
       
      </div>
      <DialogContent dividers sx={{ overflowX: "hidden" }}>
        <Typography variant="body2" gutterBottom>
          {hotel.description}
        </Typography>
        <HotelImagesCarousel hotel={hotel} />

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Facilities
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {hotel.facilityResponses?.map((f, i) => (
            <Grid item key={i}>
              <Chip key={i} label={f.name} size="small" />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6">Rooms</Typography>
        <RoomList roomResponses={hotel.roomResponses} />

        <Typography variant="h6">Contact</Typography>
        <Typography>Email: {hotel.email}</Typography>
        <Typography >
          Phone:{" "}
          {hotel.phoneResponses?.map((phone, index) => phone.phoneNumber).join(", ")}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
