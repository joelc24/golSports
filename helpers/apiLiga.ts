import { Config } from "@/enums/config";
import axios from "axios";


export const apiLiga = axios.create({
    baseURL: Config.baseUrlApi
})