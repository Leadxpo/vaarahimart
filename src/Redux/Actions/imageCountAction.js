import {
    IMAGE_COUNT_SUCCESS,
    IMAGE_COUNT_REQUEST,
    IMAGE_COUNT_FAIL,

} from "../Constants/imageCountConstant";

import * as actionTyes from "../Constants/imageCountConstant";

export const totalimageCount = (imageCount) => async (dispatch) => {
    dispatch({ type: IMAGE_COUNT_REQUEST });
    if (imageCount >= 0) {
        dispatch({ type: IMAGE_COUNT_SUCCESS, payload: imageCount });
    } else {
        dispatch({ type: IMAGE_COUNT_FAIL, payload: 0 });
    }
};