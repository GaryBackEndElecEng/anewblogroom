import axios from "axios";

const csrf = process.env.NEXTAUTH_CSRF as string;
const local = process.env.NEXT_PUBLIC_local as string;
const public_ = process.env.NEXT_PUBLIC_site as string;

axios.defaults.baseURL = (process.env.NODE_ENV === "production") ? public_ : local;
axios.defaults.headers.common['Authorization'] = csrf;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded ,multipart/form-data';
axios.defaults.headers.get['Content-Type'] = 'application/json';

