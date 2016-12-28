# dockernode-app

## Build for Docker
### mkdir dockernode
### git clone git@github.com:mikarinneoracle/dockernode-app.git dockernode
### cd dockernode
### docker build -t dockernode-app .

## Image
### docker images dockernode-app

## Running
### docker run -it --rm -p 49160:3000 dockernode-app

## Testing
### curl "http://localhost:49160"
