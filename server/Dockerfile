FROM node:18.19.0-alpine3.19
#By default create-react-app sets port to 3000 when you start react app, but I configured to run ui on 8080 (just personal preference) instead of 3000.
EXPOSE 3011
RUN mkdir -p /app/config /app/src
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
## install only the packages defined in the package-lock.json (faster than the normal npm install)
RUN npm install
# Run 'npm run dev' when the container starts.
CMD ["npm", "run", "server"]