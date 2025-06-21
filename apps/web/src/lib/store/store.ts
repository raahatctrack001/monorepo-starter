import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

import userReducer from './slices/user.slice'
import postReducer from './slices/post.slice'
import reelReducer from './slices/reel.slice'
import themeReducer from './slices/theme.slice'
import conversationReducer from './slices/conversation.slice'
import messageReducer from './slices/message.slice'


// Combine reducers first
const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  reel: reelReducer,
  theme: themeReducer,
  conversation: conversationReducer,
  message: messageReducer
})

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'reel', 'conversation',  "message"], // persist slices you want — omit post if not needed
}

// Wrap reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
})

// Create persistor instance
export const persistor = persistStore(store)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
