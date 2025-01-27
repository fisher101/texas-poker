# 阶段一：构建阶段（使用Node.js环境）
FROM node:18-alpine AS builder
WORKDIR /app

# 安装依赖
COPY client/package*.json ./
RUN npm ci --silent

# 复制源码并构建
COPY client/ .
RUN npm run build

# 阶段二：生产环境镜像
FROM nginx:1.25-alpine
LABEL maintainer="your-team@example.com"

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义Nginx配置
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口并启动
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
