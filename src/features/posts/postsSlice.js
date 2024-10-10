import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL = "https://1c8b3ad3-b5ab-46a3-8bea-426be0bf282e-00-1ds7ywmeerzal.sisko.replit.dev";

//Async thunk for fetching a user's posts
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
        return response.json();
    }

);

//Async thunk for saveposts
export const savePost = createAsyncThunk(
    "posts/savePost",
    async (postContent) => {
        //Get stored JWT Token
        const token = localStorage.getItem("authToken");

        //Decode the token to fetch user id
        const decode = jwtDecode(token);
        const userId = decode.id // May change depending on how the server encode the token
        const data = {
            title: "Post Title",  //Add functionality to set this properly
            content: postContent,
            user_id: userId,
        };

        const response = await axios.post(`${BASE_URL}/posts`, data)
        return response.data;
    }

);

//Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            //action.payload = [{id:1, content: "when is lunch"}]
            //we got it from the fetchPostsByUser output or return
            state.posts = action.payload;
            //state.posts = []
            //state.posts is the current posts that you are showing

            //since action payload is returned, we will update our state
            //state.posts = [{id:1, content: "when is lunch"}]

            //before: state.loading = true
            //we want the loading animation to stops
            state.loading = false; //stopping loading animation
        }),
            builder.addCase(savePost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
            });
    },
});

//extraReducers are use to call the async state
//builder = object to add diff reducers
//addCase = if else statement
//.fulfilled - if it is done

export default postsSlice.reducer;