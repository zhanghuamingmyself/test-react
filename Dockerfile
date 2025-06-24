# node 构建
FROM node:20.14.0-alpine3.20 as build-stage
# 署名
MAINTAINER Adoin 'zhanghuamingmysql@163.com'
WORKDIR /app

COPY package*.json ./
# 设置 node 阿里镜像
RUN npm config set registry https://registry.npmmirror.com && \
    npm install && npm cache clean --force

# 复制项目文件
COPY . .

RUN npm run build

RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉"
# node部分结束

# nginx 部署
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/zhm-react
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD nginx -g 'daemon off;'
RUN echo "🎉 架 🎉 设 🎉 成 🎉 功 🎉"
