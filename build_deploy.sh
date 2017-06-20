#!/bin/bash

export tag=$(docker build -t dockernode . | grep 'Successfully built' | tail -c 13)

echo $tag

docker tag $tag mikarinneoracle/dockernode:sticky

docker push mikarinneoracle/dockernode

#docker run -it --rm -p 80:3000 mikarinneoracle/dockernode:sticky
