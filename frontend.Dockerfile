# --- Tahap 1: Build Stage ---
# Menggunakan image resmi yang sudah terinstall bun
FROM oven/bun:1.0 as build-stage

# Menetapkan direktori kerja di dalam kontainer
WORKDIR /app

# Menyalin file package.json dan bun.lockb terlebih dahulu untuk caching
COPY frontend/package.json frontend/bun.lockb* ./

# Menginstal semua dependensi
RUN bun install --frozen-lockfile

# Menyalin sisa kode frontend
COPY frontend/ .

# Membangun aplikasi untuk produksi
RUN bun run build

# --- Tahap 2: Production Stage ---
# Menggunakan image Nginx yang sangat ringan
FROM nginx:stable-alpine as production-stage

# Menyalin hasil build dari tahap sebelumnya ke direktori default Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Saat kontainer berjalan, Nginx akan otomatis menyajikan file dari direktori di atas
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
