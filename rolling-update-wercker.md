# Rolling update sticky sessions with Wercker

## Deploy the rolling update sticky sessions service

### Clone the repository

<pre>
mkdir docker-images
git clone git@github.com:oracle/docker-images.git docker-images
cd docker-images/ContainerCloud
</pre>

### Login to Docker Hub
You will be building Docker images and pushing them to Docker Hub. In order to push to Docker Hub, you will need to authenticate with Docker Hub. Open a terminal and login to Docker Hub with this command:

<pre>
docker login
</pre>

You will then be prompted for your username and password. Enter your Docker Hub account name (which is NOT your email address). You can find this by logging in to Docker Hub in a Web browser and finding the name next to your avatar in the top navigation of the Docker Hub Web site.

<pre>
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username:
Password:
Login Succeeded
</pre>

### Configure the Builder to Use Your Docker Hub Account

Before you can build your first stack, open [images/build/vars.mk](images/build/vars.mk) and set the registry name variable as your Docker Hub account (usernames should be entered in lower case):

<pre>
REGISTRY_NAME ?= your_docker_hub_username
</pre>

### Build the image

Build the `rolling-router-sticky-sessions`image using make:

<pre>
cd images/rolling-router-sticky-sessions
make
</pre>

This will upload the image to your Docker-hub.

![Logo](docker-hub-rolling-router.png)

### Create the OCCS service

Login to OCCS and create a new service `rolling-router-sticky` with the following YML where the image repository refers to your Docker-hub account (bolded): 

<pre>
version: 2
services:
  rolling-router-sticky:
    image: '<b>mikarinneoracle</b>/rolling-router-sticky-sessions:0.2'
    environment:
      - 'OCCS_API_TOKEN={{api_token}}'
      - KV_IP=172.17.0.1
      - KV_PORT=9109
      - APP_NAME=docker-hello-world
      - 'occs:availability=per-pool'
      - 'occs:scheduler=random'
    ports:
      - '80:80/tcp'
      - '8080:8080/tcp'
</pre>

If you haven't build the image of your own, you can use the YML above as is.

Deploy the service.

## Deploy the rolling router sticky sessions keyvalues with the GUI

Check the worker host `public_ip` from the OCCS admin:

![Logo](occs-host-ip.png)

Check also the `API token` a.k.a Bearer from Settings/My Account:

![Logo](occs-bearer.png)

From your browser open the URL pointing to the worker host public_ip address e.g. `http://140.86.1.96:8080`.

The rolling router sticky sessions GUI should show up with a setup screen.

Enter the OCCS admin host ip, API Token (Bearer), Application name `docker-hello-world` and the preferred `host port` of the Docker application e.g. 3000:

![Logo](rolling-router-ss-login.png)

Press OK. The following screen should show up if the login with given OCCS admin IP and API token was succesful:

![Logo](rolling-router-ss-create-keyvalues.png)

Let's create the initial keyvalues for the hello world application deployment by selecting the following values from the dropdowns:

![Logo](rolling-router-ss-set-keyvalues.png)

Set the values like this:

![Logo](rolling-router-ss-keyvalues-set.png)

This will store the values in OCCS keyvalues for the hello world application in host port 3000:

![Logo](occs-keyvalues.png)

## Setting up Wercker CI/CD

### Building the hello world application base box image for Wercker

Since our rolling router sticky sessions CI/CD for OCCS script uses utilities like `jq`, `recode` and `curl` we first we have selected `Ubuntu`as the base image for our hello world `Node.js` application. 

First we are building Ubuntu image with the utilities included from `scratch` and then using the Ubuntu image we build the hello world appliucation image for the rolling router sticky sessions deployment.

Here's the <a href="https://github.com/mikarinneoracle/docker-brew-ubuntu-core/blob/dist/trusty/Dockerfile#L50">Dockerfile</a> for the forked Ubuntu project with the following additions to enable the utilities with Node.js in the Ubuntu image:

<pre>
RUN sudo apt-get -y install libc-dev-bin libc6 libc6-dev
RUN sudo apt-get install -y recode
RUN sudo apt-get install -y jq
RUN sudo apt-get install -y curl
RUN sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN sudo apt-get install -y build-essential
</pre>

Build the image and push it Docker hub:
<pre>
export tag=$(docker build -t ubuntu . | grep 'Successfully built' | tail -c 13)
docker tag $tag mikarinneoracle/ubuntu:trusty
docker push mikarinneoracle/ubuntu
</pre>

After build the image is pushed to Docker hub:

![Logo](docker-hub-ubuntu-trusty.png)







