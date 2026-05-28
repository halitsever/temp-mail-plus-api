import axios, { AxiosInstance } from 'axios';
import { TempMailOptions } from './types';

export default class HttpClient {

    private readonly baseUrl: string = "https://tempmail.plus/api";
    private readonly defaultHeaders: Record<string, string> = {
        'sec-ch-ua-platform': '"macOS"',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'sec-ch-ua-mobile': '?0',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'DNT': '1'
    };

    private readonly axiosInstance: AxiosInstance;

    constructor(options?: TempMailOptions) {
        this.axiosInstance = axios.create({
            timeout: options?.timeout ?? 10_000,
            baseURL: this.baseUrl,
            headers: this.defaultHeaders
        });
    }

    async get<T>(url: string, params?: Record<string, string>): Promise<T> {
        return this.axiosInstance.get<T>(url, { params })
            .then(response => response.data)
            .catch(error => {
                console.error(`Error fetching data from ${url}:`, error);
                throw error;
            });
    }

    async delete<T>(url: string, body?: Record<string, string>): Promise<T> {
        return this.axiosInstance.delete<T>(url, {
            data: new URLSearchParams(body).toString(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        })
            .then(response => response.data)
            .catch(error => {
                console.error(`Error deleting resource at ${url}:`, error);
                throw error;
            });
    }
}
