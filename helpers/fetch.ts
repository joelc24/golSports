import axios from 'axios';

export const fetcher = (...args: [key:string]) => axios.get(...args).then(res => res.data)