FROM ubuntu

WORKDIR /app

COPY package*.json ./

RUN apt update
RUN apt install python3-pip -y
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash 
RUN apt-get install nodejs
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN apt install ffmpeg
RUN apt update

RUN npm install

COPY . .

CMD ["npm", "start"]
