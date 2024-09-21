/** @type {import('next').NextConfig} */
import { i18n } from './next-i18next.config.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  i18n,
  reactStrictMode: true,
  async rewrites() {
    if (isDev) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8000/api/:path*/',
        },
        {
          source: '/auth/:path*',
          destination: 'http://127.0.0.1:8000/auth/:path*/',
        },
      ];
    }
    return [];
  },
  async headers() {
    if (isDev) {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept' },
          ],
        },
        {
          source: '/auth/:path*',
          headers: [
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept' },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
