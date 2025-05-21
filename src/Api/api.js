import axios from "react-native-axios"

const googleMapAPI="AIzaSyAYEBxIJfhpD9dSQRxFp4yR3D_nxZkOZLs";
const googleMapAndrodSDK_API="AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo";
const api = axios.create({
  baseURL: "https://vaarahimart.com/mob",
  headers: {
    "Content-Type": "application/json"
  }
})

export default api