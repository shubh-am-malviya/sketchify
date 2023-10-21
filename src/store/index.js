import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./slices/menuSlice";

const store = configureStore({
	reducer: {
		menu: menuReducer,
	},
});

export default store;
