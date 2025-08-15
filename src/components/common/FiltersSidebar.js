"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  TextField,
  Divider,
} from "@mui/material";

const BOARD_TYPES = [
  { code: "AI", name: "ALL INCLUSIVE" },
  { code: "BB", name: "BED AND BREAKFAST" },
  { code: "FB", name: "FULL BOARD" },
  { code: "HB", name: "HALF BOARD" },
  { code: "RO", name: "ROOM ONLY" },
];

const STAR_CATEGORIES = [1, 2, 3, 4, 5];
const REVIEW_RATINGS = [1, 2, 3, 4, 5];

export default function FiltersSidebar({ filters, onChange,setSearchTerm,searchTerm }) {
  const [priceRange, setPriceRange] = useState([
    filters?.extrafilter?.minRate || 0,
    filters?.extrafilter?.maxRate || 100000,
  ]);
  const [ratingRange, setRatingRange] = useState([
    filters?.reviews?.[0]?.minRate || 0,
    filters?.reviews?.[0]?.maxRate || 5,
  ]);
  const [reviewRatings, setReviewRatings] = useState(
    filters?.reviews?.map((r) => r.minRate) || []
  );
  const [boardTypes, setBoardTypes] = useState(filters?.boards?.board || []);

  const handleCheckboxChange = (value, setState, stateKey) => {
    const newState = stateKey.includes(value)
      ? stateKey.filter((v) => v !== value)
      : [...stateKey, value];
    setState(newState);
    onChange({ ...filters, [stateKey]: newState });
  };

  const handleBoardChange = (code) => {
    const newBoards = boardTypes.includes(code)
      ? boardTypes.filter((b) => b !== code)
      : [...boardTypes, code];
    setBoardTypes(newBoards);
    onChange({ ...filters, boards: { board: newBoards, included: true } });
  };

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
    onChange({
      ...filters,
      extrafilter: {
        ...filters.extrafilter,
        minRate: newValue[0],
        maxRate: newValue[1],
      },
    });
  };
   const handleRatingChange = (_, newValue) => {
    setRatingRange(newValue);
    onChange({
      ...filters,
      reviews: [
        {
          ...filters.reviews?.[0],
          minRate: newValue?.[0],
          maxRate: newValue?.[1],
        },
      ],
    });
  };


  
  return (
    <Box sx={{ p: 2, width: 250, borderRight: "1px solid #ddd" }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      {/* Search by property name */}
      <TextField
        size="small"
        placeholder="Search by Property Name"
        fullWidth
        margin="normal"
        value={searchTerm|| ""}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Typography variant="subtitle2" gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={100000}
      />

      <Divider sx={{ my: 2 }} />

      {/* Star Category */}
      <Typography variant="subtitle2" gutterBottom>
        Star Category
      </Typography>
      <Slider
        value={ratingRange}
        onChange={handleRatingChange}
        valueLabelDisplay="auto"
        min={0}
        max={5}
      />
    

      <Divider sx={{ my: 2 }} />

      {/* TripAdvisor Ratings */}
      <Typography variant="subtitle2" gutterBottom>
        TripAdvisor Rating
      </Typography>
      <FormGroup>
        {REVIEW_RATINGS.map((rate) => (
          <FormControlLabel
            key={rate}
            control={
              <Checkbox
                checked={reviewRatings.includes(rate)}
                onChange={() => {
                  const newRatings = reviewRatings.includes(rate)
                    ? reviewRatings.filter((r) => r !== rate)
                    : [...reviewRatings, rate];
                  setReviewRatings(newRatings);
                  onChange({
                    ...filters,
                    reviews: newRatings.map((r) => ({
                      minRate: r,
                      maxRate: r,
                      minReviewCount: 1,
                      type: "TRIPADVISOR",
                    })),
                  });
                }}
              />
            }
            label={`${rate} Stars`}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {/* Board Types */}
      <Typography variant="subtitle2" gutterBottom>
        Board Type
      </Typography>
      <FormGroup>
        {BOARD_TYPES.map((board) => (
          <FormControlLabel
            key={board.code}
            control={
              <Checkbox
                checked={boardTypes.includes(board.code)}
                onChange={() => handleBoardChange(board.code)}
              />
            }
            label={board.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
}
