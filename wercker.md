# Rolling router with Wercker

Since the Oracle acquisition of <a href="http://www.wercker.com/">Wercker</a> we have moved the 
<a href="https://gist.github.com/mikarinneoracle/5f1e513f2a856a3be86c31c3f0dcabe2#rolling-deployments">deployment process
of the rolling router</a> from Travis CI to Wercker.

The changes aren't big. The main difference is that whereas Travis CI uses the `Ubuntu` shell environment to build and deploy 
the desired application Wercker uses any Docker image, called as base `box`, as the base image and environment for the build and deploy process for a Wercker `application`. In Wercker this process is called as `workflow`. 

### Building the base box

To support the utilities required by the original script like `curl`, `jq` and `recode` we've also chosen Ubuntu as the `box` for our Wercker application and it's workflow.

The first thing to do is to build our sample Node.js application image on top of the Ubuntu image using 
<a href="https://github.com/mikarinneoracle/dockernode-app/blob/master/Dockerfile">this Dockerfile</a>.
Here, we are using Wercker's source directory `/pipeline/source` as the `WORKDIR`.

Once this image is built we can then use it as the box for the Wercker workflow.

### Creating the workflow and pipelines

Each Wercker workflow needs a `Wercker.yml` that defines the steps for it. In our sample Node.js application the <a href="https://github.com/oracle/docker-images/blob/master/ContainerCloud/images/rolling-router-sticky-sessions/wercker.yml">Wercker.yml file looks like this<a>.

Here, the Wercker.yml consists of the box definition and then two `pipelines` named as `build` and `deploy`.

The box definition is based on our Node.js application image that we just build on top of Ubuntu:

<pre>
box:
    id: $DOCKER_REGISTRY/$IMAGE_NAME
    tag: $APP_TAG
    registry: https://registry.hub.docker.com
</pre>

Here, the Docker box image e.g. `mikarinneoracle/dockernode` is specified by the application `environment variables` `$DOCKER_REGISTRY` and `$IMAGE_NAME`.

What's new compared to the original Travis CI is the optional `$APP_TAG` environment variable that specifies the tag for our box application. The default value for this is `latest`. In our case we are using value `wercker` as the tag for the box image. In principle the variables are the same we used in the Travis CI.

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

The first step `check` is just to verify we have built our box from a correct image having the required utlities available for the actual deploy to Oracle Container Cloud service.

The second step `internal/docker-push` pushes the built image to Docker-hub repository. Here, we are using `$WERCKER_MAIN_PIPELINE_STARTED` timestamp as the tag for the image being pushed instead of the `$TRAVIS_BUILD_NUMBER`that we used in the Travis CI. That's the other change we have between Travis CI and Wercker application environment variables.

The final step of deploy pipeline, and the whole workflow, is the actual deploy to Oracle Container Cloud service.
This is done as a `registry step`that is found in the <a href="https://app.wercker.com/search/steps/oracle">Wercker registry</a> with a name `mikarinneoracle/ORACLE-OCCS-rolling-router-deploy@1.0.0`.

The source code of the `run.sh` for the registry step is found in <a href="https://github.com/mikarinneoracle/ORACLE-OCCS-rolling-router-deploy">this git-hub project</a>. It also includes the `wercker-step.yml` that defines the required and optional parameters for the step. These variables can be saved as environment variables for the application like we have seen in previous steps.

### Workflow in Wercker UI

To run the workflow for the application it should look like this having the build and deploy pipelines:

![Logo](workflow.png)


### Starting the workflow

After the workflow has been created and the wercker.yml added to the application the workflow can be then started by committing and pushing a change to it.  When the workflow has run succesfully the deploy pipeline result should look like this:

![Logo](deploy.png)

After the succesful completition of the workflow a new image of the application with a timestamp tag should be pushed to Docker-hub and deployed to Oracle Container Cloud Service. If there was a previous candidate version of the application running in OCCS it should have also been deleted.

![Logo](docker-hub.png)

![Logo](deployments.png)

### First time deployment

In the first commit it is normal that the workflow fails to the last step since there's no previous candidate version available to be removed from OCCS.

![Logo](build-deploy.png)

This error can been seen from the step log:
<pre>
Tried to remove inactive deployment rolling/null but it doesn't exist.
</pre>

