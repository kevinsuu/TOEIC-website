# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY build/ /usr/share/nginx/html

# 使用 Node.js 的官方镜像作为基础
FROM node:latest

# 设置工作目录
WORKDIR /toeic-website-app

# 安装 serve
RUN npm install -g serve

# 复制构建好的静态文件到工作目录
COPY build ./build

# 在容器启动时运行 serve -s build
CMD ["serve", "-s", "build", "-l", "80"]
