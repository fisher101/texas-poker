# 构建阶段
FROM node:18-alpine AS builder
WORK /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./public/cards /usr/share/nginx/html/cards
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
