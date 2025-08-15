"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";
import SearchForm from "@/components/SearchForm";
import FiltersSidebar from "@/components/common/FiltersSidebar";
import HotelCard from "@/components/hotel/HotelCard";
import HotelDetailsModal from "@/components/hotel/HotelDetailsModal";
import { searchHotels } from "@/lib/HotelApis";
import { buildHotelSearchPayload } from "@/utils/buildSearchPayload";
import {
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function ResultsPage() {
  const searchParams = useSearchParams();

  // Extract params individually
  const destination = searchParams.get("destination");
  const destinationId = searchParams.get("destinationId");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const rooms = searchParams.get("rooms");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const childrenAges = searchParams.get("childrenAges");
  const [hotel, setHotel] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Build API payload
  const payload = useMemo(() => {
    const basePayload = buildHotelSearchPayload(
      {
        destination,
        destinationId,
        fromDate,
        toDate,
        rooms,
        adults,
        children,
        childrenAges,
      },
      filters
    );

    return basePayload;
  }, [
    destination,
    destinationId,
    fromDate,
    toDate,
    rooms,
    adults,
    children,
    childrenAges,
    filters,
  ]);
  const { data, error, isLoading } = useSWR(
    destination ? ["searchHotels", payload] : null,
    () => searchHotels(payload),
    {
      revalidateOnFocus: false,
      retry: 0,
      onSuccess: (data) => {
        setHotel(data?.data?.data || []);
      },
    }
  );

  const handleViewDetails = async (hotel) => {
    setSelectedHotel(hotel);
    setOpenDetails(true);
  };
  const getLowestPrice = (hotel) => {
    if (!hotel?.roomResponses?.length) return 0;

    const prices = hotel?.roomResponses.map(
      (room) => room?.rateKeyResponses?.totalPrice
    );

    return prices.length ? Math.min(...prices) : 0;
  };

const sortedHotels = useMemo(() => {
  if (!hotel || hotel.length === 0) return [];

  // Filter by hotel name first
  let filteredHotels = searchTerm.length < 0 ? [...hotel] : [...hotel].filter((h) =>
    h.hotelName.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  // Make a copy to avoid mutating state
  const hotelCopy = [...filteredHotels];

  if (sortOrder === "lowToHigh") {
    return hotelCopy.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
  } else if (sortOrder === "highToLow") {
    return hotelCopy.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
  } else {
    return hotelCopy;
  }
}, [hotel, sortOrder, searchTerm]);

  return (
    <Box>
      {/* Search Form */}
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
        <SearchForm />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: { xs: "block", md: "flex" } }}>
        <Box sx={{ width: { xs: "100%", md: 250 }, flexShrink: 0 }}>
          <FiltersSidebar filters={filters} onChange={setFilters} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </Box>

        <Box sx={{ flex: 1, p: 2 }}>
          {/* Sort Dropdown */}
          <Box sx={{ mb: 2, maxWidth: 200 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={sortOrder}
                label="Sort by Price"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="Relevance">Relevance</MenuItem>
                <MenuItem value="lowToHigh">Low to High</MenuItem>
                <MenuItem value="highToLow">High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Hotel List */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box>Error loading hotels</Box>
          ) : data?.data?.data?.length === 0 ? (
            <Box>No hotels found for the selected criteria.</Box>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              {sortedHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </Box>
      </Box>

      {/* Hotel Details Modal */}
      <HotelDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        hotel={selectedHotel}
      />
    </Box>
  );
}
