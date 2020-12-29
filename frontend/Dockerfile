FROM node:13.13.0-alpine as build


WORKDIR /app

#copy the app

COPY . /app/

# prep the container

RUN npm install --silent
RUN npm install react-scripts -g --silent

RUN npm run build #make the build

#prep nginx

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

#fire up nginx

EXPOSE 80
CMD ["nginx","-g","daemon off;"]