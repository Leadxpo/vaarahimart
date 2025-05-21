import { SET_THEME_MODE ,SET_COLOR_MODE} from "../Constants/themeConstant"

export const setTheme = (mode) => {
    return {
        type : SET_THEME_MODE,
        payload : mode
    }
}

export const setColor = (color) => {
    return {
        type : SET_COLOR_MODE,
        payload : color
    }
}