FROM mikarinneoracle/ubuntu:trusty

# Create app directory; same as Wercker default
RUN mkdir -p /pipeline/source
WORKDIR /pipeline/source

# Install app dependencies
COPY package.json /pipeline/source/
RUN npm install

# Bundle app source
COPY . /pipeline/source/

EXPOSE 3000
CMD [ "npm", "start" ]
