import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface SearchState {
    searchResults: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: SearchState = {
    searchResults: [],
    loading: false,
    error: null,
};

// `createAsyncThunk` is used to handle asynchronous API requests in Redux Toolkit.
// It automatically generates action types for pending, fulfilled, and rejected states.
export const fetchSearchResults = createAsyncThunk<Product[], void>(
    'search/fetchSearchResults',
    async (_, { errorvalue }) => {
        try {
            const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
            return response.data; // If successful, returns the fetched data.
        } catch (error: any) {
            return errorvalue(error.response?.data || 'An error occurred'); // Handles errors properly.
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        sortByName: (state) => {
            state.searchResults = [...state.searchResults].sort((a, b) => a.title.localeCompare(b.title));
        },
        
        sortByRangePrice: (state, action: PayloadAction<{ minPrice: number; maxPrice: number }>) => {   
            state.searchResults = state.searchResults.filter(
                (product) => product.price >= action.payload.minPrice && product.price <= action.payload.maxPrice
            );
        },
        searchTitle: (state, action: PayloadAction<string>) => {
            state.searchResults = state.searchResults.filter(
                (product) => product.title.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        GetBycategory: (state, action: PayloadAction<string>) => {
            state.searchResults = state.searchResults.filter(
                (product) => product.category.toLowerCase().includes(action.payload.toLowerCase())
            );
        }
    },
    extraReducers: (builder) => {
        builder
            // When the async request starts, set `loading` to true.
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // When the request is successful, store the fetched data in `searchResults`.
            .addCase(fetchSearchResults.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            // If the request fails, set the `error` state.
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { sortByName, sortByRangePrice, searchTitle, GetBycategory } = searchSlice.actions;

export default searchSlice.reducer;
