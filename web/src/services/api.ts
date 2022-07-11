import axios, { AxiosError } from 'axios';
import {parseCookies, setCookie} from 'nookies';

import { signOut } from '../context/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

const thirtyDays = 60 * 60 * 24 * 30; // 30 dias

let isRefreshing = false;

let failedRequestsQueue: any[] = [];

export const setupAPIClient = (ctx = undefined) => {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  });
  
  api.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);
  
        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;
  
        if (!isRefreshing) {
          isRefreshing = true;
  
          api.post('/refresh', {
            refreshToken
          }).then((response) => {
            const { token } = response.data;
  
            setCookie(ctx, "nextauth.token", token, {
              maxAge: thirtyDays, // 30 dias
              path: "/",
            })
      
            setCookie(ctx, "nextauth.refreshToken", response.data.refreshToken, {
              maxAge: thirtyDays, // 30 dias
              path: "/",
            })
  
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
  
            failedRequestsQueue.forEach((req) => req.resolve(token))
            failedRequestsQueue = [];
          }).catch(err => {
            failedRequestsQueue.forEach((req) => req.reject(err))
            failedRequestsQueue = [];

            // if (typeof window) {
            //   signOut();
            // }
          }).finally(() => {
            isRefreshing = false;
          });
        }
  
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            // resolve será executado quando houver sucesso no refresh
            resolve: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
  
              resolve(api(originalConfig));
            },
            // reject será executado quando houver erro no refresh
            reject: (err: AxiosError) => {
              reject(err);
            },
          })
        })
      } else {
        if (typeof window) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
    }
  
    return Promise.reject(error);
  });

  return api;
}
