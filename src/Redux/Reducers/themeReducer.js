import { SET_COLOR_MODE, SET_THEME_MODE } from "../Constants/themeConstant";

const initialState = {
    mode : ".theme-mode-light",
    color : ".theme-color-blue"
};
export const themeReducer = (state = initialState , action) => {
    switch (action.type) {
        case SET_THEME_MODE:
            return {
                ...state,
                mode : action.payload
            }
        case SET_COLOR_MODE:
            return {
                ...state,
                color : action.payload
            }
        default : return state
    }
}

