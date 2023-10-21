import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./slices/menuSlice";
import toolBoxReducer from "./slices/toolboxSlice";

const store = configureStore({
	reducer: {
		menu: menuReducer,
		toolBox: toolBoxReducer,
	},
});

export default store;
