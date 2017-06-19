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

Login to OCCS and create a new service `rolling-router-sticky-sessions` with the following YML where the image repository refers to your Docker-hub account (bolded): 

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

Then deploy the service.








