FROM naseer2426/gl-dep

WORKDIR /app

COPY . /app

EXPOSE 8080

RUN npm init -y
RUN npm install --save child_process express multer unzipper cors

CMD ["node","app.js"]