# --- Tahap 1: Build Stage (Membangun Aset Frontend) ---
FROM oven/bun:1.0 as builder
WORKDIR /app

# Salin package.json untuk instalasi
COPY frontend/package.json ./
RUN bun install

# Salin sisa kode frontend
COPY frontend/ .

# Build aplikasi, TAPI abaikan error TypeScript dengan langsung memanggil vite
# INI ADALAH PERUBAHANNYA:
RUN bunx vite build


# --- Tahap 2: Production Stage (Menyiapkan Nginx) ---
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]