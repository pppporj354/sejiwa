# --- Tahap 1: Build Aset Frontend ---
FROM oven/bun:1.0 as builder
WORKDIR /app
COPY frontend/package.json frontend/bun.lockb ./
RUN bun install --frozen-lockfile
COPY frontend/ .
RUN bun run build

# --- Tahap 2: Siapkan Image Nginx Produksi ---
FROM nginx:stable-alpine
# Salin hasil build dari tahap sebelumnya ke direktori web Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Salin file konfigurasi Nginx kustom kita
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Perintah untuk menjalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
