import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  sortByName,
  sortByRangePrice,
  searchTitle,
  GetBycategory,
} from "../features/SearchSlice";
import type { AppDispatch } from "../app/store";
import type { RootState } from "../app/store";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Search = () => {
  const products = useSelector((state: RootState) => state.search.searchResults);
  const dispatch = useDispatch<AppDispatch>();


  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchSearchResults());
  }, [dispatch]);

  // useCallback to prevent unnecessary re-renders
  const handleSortByName = useCallback(() => {
    dispatch(sortByName());
  }, [dispatch]);

  const handleSortByRangePrice = useCallback(() => {
    const min = Number(minPriceRef.current?.value);
    const max = Number(maxPriceRef.current?.value);

    if (!min || !max) {
      alert("Please enter both minimum and maximum price values.");
      return;
    }
    if (min <= 0 || max <= 0) {
      alert("Prices must be greater than 0.");
      return;
    }
    if (min > max) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }

    dispatch(sortByRangePrice({ minPrice: min, maxPrice: max }));
  }, [dispatch]);

  const handleSearchByTitle = useCallback(() => {
    const title = titleRef.current?.value || "";
    dispatch(searchTitle(title));
  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#0d1b2a",
        padding: 4,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ color: "white", textAlign: "center", mb: 3 }}>
          List of Products
        </Typography>

        {/* Sorting & Filters */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            mb: 4,
          }}
        >
          <Button onClick={handleSortByRangePrice} variant="contained" sx={{ backgroundColor: "#1b263b", color: "white" }}>
            Sort by Range Price
          </Button>

          <TextField
            type="number"
            label="Min Price"
            inputRef={minPriceRef}
            size="small"
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />
          <TextField
            type="number"
            label="Max Price"
            inputRef={maxPriceRef}
            size="small"
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />

          
          <Button onClick={handleSortByName} variant="contained" sx={{ backgroundColor: "#1b263b", color: "white" }}>
            Sort by Name
          </Button>

          <TextField
            type="text"
            label="Search by Title"
            inputRef={titleRef}
            size="small"
            sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          />

          <Button onClick={handleSearchByTitle} variant="contained" sx={{ backgroundColor: "#1b263b", color: "white" }}>
            Search by Title
          </Button>
        </Box>

        {/* Category Filter */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "white" }}>Category</InputLabel>
          <Select
            defaultValue=""
            onChange={(e) => dispatch(GetBycategory(e.target.value))}
            sx={{ color: "white", backgroundColor: "#1b263b", borderRadius: 1 }}
          >
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="jewelery">Jewelry</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>

        {/* Products List */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              sx={{
                backgroundColor: "#1b263b",
                color: "white",
                borderRadius: 2,
                padding: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.title}
                sx={{
                  objectFit: "contain",
                  backgroundColor: "#415a77",
                  borderRadius: 1,
                }}
              />
              <CardContent>
                <Typography variant="h6">{product.title}</Typography>
                <Typography variant="body2">Category: {product.category}</Typography>
                <Typography variant="body1" fontWeight="bold">
                  Price: ${product.price}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Search;
