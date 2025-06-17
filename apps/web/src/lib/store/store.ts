import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'
import postReducer from './slices/post.slice'
import reelReducer from './slices/reel.slice'
import messageReducer from './slices/message.slice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    reel: reelReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
})

// Infer RootState and AppDispatch types

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
