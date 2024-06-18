import axios from "axios"

const auth = localStorage.getItem("authState") ? JSON.parse(localStorage.getItem("authState")!) : {}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Authorization": `Bearer ${auth?.token}`
  }
})