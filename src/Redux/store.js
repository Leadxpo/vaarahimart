
// store.js
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';  // Import the combined reducer

// const store = configureStore({
//   reducer: rootReducer,  // rootReducer with 'userLogin' included
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in development
});

export default store;
