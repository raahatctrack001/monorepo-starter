import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    theme: 'system',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            state.theme = action.payload;
        },
        }
});

export const {toggleTheme} = themeSlice.actions;
export default themeSlice.reducer;