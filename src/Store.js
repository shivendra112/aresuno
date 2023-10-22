import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import businessReducer from "./businessSlice"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({
    user: userReducer,
    business: businessReducer
})

const persistConfig = {
    key: 'root',
    storage
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
        
    })
})

const persistor = persistStore(store)

export { store, persistor }