import axios from "axios";

export const httpClient = axios.create({
  timeout: 5000,
});

export class HttpClient {
    async get(url: string, options?: RequestInit): Promise<Response> {
        return fetch(url, { method: 'GET', ...options });
    }

    async post(url: string, body: any, options?: RequestInit): Promise<Response> {
        return fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...options });
    }

    async put(url: string, body: any, options?: RequestInit): Promise<Response> {
        return fetch(url, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...options });
    }

    async delete(url: string, options?: RequestInit): Promise<Response> {
        return fetch(url, { method: 'DELETE', ...options });
    }
}