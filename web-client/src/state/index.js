import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    theme: 'dark',
    token: null,
    currentUser: null,
    posts:[],
    stories:[],
    snackbar: {
        open: false,
        message: '',
        severity: 'error',
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTheme:(state) => {
            state.theme = state.theme==="dark"?"light":"dark";
        },
        setLogin:(state, action) => {
            if (action.payload.currentUser !== undefined) {
                state.currentUser = action.payload.currentUser;
            }
            if (action.payload.token !== undefined) {
                state.token = action.payload.token;
            }
        },
        setLogout:(state) => {
            state.currentUser= null;
            state.token = null;
        },
        updateCurrentUser:(state,action) => {
            state.currentUser=action.payload.currentUser;
        },
        setFollowings:(state,action) => {
            if(state.currentUser){
                state.currentUser.followings=action.payload.followings;
            }
            else{
                console.log("No Following Users found");
            }
        },
        setPosts:(state,action) => {
            state.posts=action.payload.posts;
        },
        setPost:(state,action) => {
            const updatedPosts=state.posts.map((post)=>{
                if(post._id===action.payload.post._id){
                    return action.payload.post;
                }
                return post;
            })
            state.posts=updatedPosts;
        },
        deletePost: (state, action) => {
            const postIdToDelete = action.payload.postId;
            state.posts = state.posts.filter(post => post._id !== postIdToDelete);
        },

        setStories:(state,action) => {
            state.stories=action.payload.stories;
        },
        updateStory:(state,action) => {
            const updatedSrories=state.posts.map((story)=>{
                if(story._id===action.payload.story._id){
                    return action.payload.story;
                }
                return story;
            })
            state.posts=updatedSrories;
        },
        deleteStory: (state, action) => {
            const storyIdToDelete = action.payload.storyId;
            state.stories = state.stories.filter(story => story._id !== storyIdToDelete);
        },

        openSnackbar: (state, action) => {
            state.snackbar.open = true;
            state.snackbar.message = action.payload.message;
            state.snackbar.severity = action.payload.severity;
        },
        closeSnackbar: (state) => {
            state.snackbar.open = false;
            state.snackbar.message = state.snackbar.message || '';
            state.snackbar.severity = state.snackbar.severity || 'error';
        },
    },
});

export const {
    setTheme,
    setLogin,
    setLogout,
    setFollowings,
    setPosts,
    setPost,
    updateCurrentUser,
    deletePost,
    openSnackbar,
    closeSnackbar,
    setStories,
    updateStory,
    deleteStory,

} = authSlice.actions;

export default authSlice.reducer;