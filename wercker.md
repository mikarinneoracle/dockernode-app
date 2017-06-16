Since the Oracle acquisition of <a href="http://www.wercker.com/">Wercker</a> we have moved the 
<a href="https://gist.github.com/mikarinneoracle/5f1e513f2a856a3be86c31c3f0dcabe2#rolling-deployments">deployment process
of the rolling router</a> from Travis CI to Wercker.

The changes aren't big. The main difference is that whereas Travis CI uses `Ubuntu` shell environment to build and deploy 
the desired application Wercker uses any Docker image, called as base `box`, as the base image and environment for the build and deploy process. In Wercker this process is called as `workflow`. 

To support the utilities required by the original script like `curl`, `jq` and `recode` we've also chosen Ubuntu as the `box` for our application and it's workflow by Wercker.

The first thing to do is to build our sample Node.js application image on top of the Ubuntu image using 
<a href="https://github.com/mikarinneoracle/dockernode-app/blob/master/Dockerfile">this Dockerfile</a>.
Here, we are using Wercker's source directory `/pipeline/source` as the `WORKDIR`.

Once this image is built we can then use is as the box for the Wercker workflow.

Each Wercker workflow needs a `Wercker.yml` that defines the steps for it. In our sample Node.js application the <a href="https://github.com/oracle/docker-images/blob/master/ContainerCloud/images/rolling-router-sticky-sessions/wercker.yml">Wercker.yml file looks like this<a>.

Here, the Wercker.yml consists of box definition and then two `pipelines` named as `build` and `deploy`.

The box definition is based on our application image:

<pre>
box:
    id: $DOCKER_REGISTRY/$IMAGE_NAME
    tag: $APP_TAG
    registry: https://registry.hub.docker.com
</pre>

The Docker Hub account is specified by the workflow `environment variables`. Here, what's new compared to the original Travis CI is the optional `$APP_TAG` that specifies the tag for our box appliaction. The default value for this is `latest`.

The build pipeline is very simple consisting only of one `step`:

<pre>
build:
  steps:
    - npm-install
</pre>

The deploy pipeline that is executed after a succesful build pipeline is a bit more complex having three steps:

<pre>
deploy:
  steps:
    - script:
        name: check
        code: |
            npm --version
            node --version
            jq --version
            curl --version
            recode --version
    - internal/docker-push:
        username: $DOCKER_USERNAME
        password: $DOCKER_PASSWORD
        tag: $WERCKER_MAIN_PIPELINE_STARTED
        repository: $DOCKER_REGISTRY/$IMAGE_NAME
        registry: https://registry.hub.docker.com
    - mikarinneoracle/ORACLE-OCCS-rolling-router-deploy@1.0.0
</pre>

The first step `check` is just to verify we have built our box from a correct image having the required utlities available for the actual deploy for the Oracle Container Cloud service.

The second step `internal/docker-push` pushes the built image to Docker-hub repository. Here, we are using `$WERCKER_MAIN_PIPELINE_STARTED` timestamp as the tag for the built image.



