import axios from 'axios';

export const api = axios.create({
    // ip da maquina local
    baseURL: 'http://192.168.10.191:3333'
});