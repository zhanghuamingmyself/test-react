# node 构建
FROM node:20-alpine as build-stage
# 署名
MAINTAINER Adoin 'zhanghuamingmysql@163.com'
WORKDIR /app
COPY . ./
# 设置 node 阿里镜像
RUN npm config set registry https://registry.npmmirror.com
# 设置--max-old-space-size
#ENV NODE_OPTIONS=--max-old-space-size=16384
# 设置阿里镜像、依赖、编译
RUN npm install && \
    npm run build
# node部分结束
RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉"


# nginx 部署
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/zhm-react
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD nginx -g 'daemon off;'
RUN echo "🎉 架 🎉 设 🎉 成 🎉 功 🎉"
