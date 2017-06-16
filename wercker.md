Since the Oracle acquisition of <a href="http://www.wercker.com/">Wercker</a> we have moved the 
<a href="https://gist.github.com/mikarinneoracle/5f1e513f2a856a3be86c31c3f0dcabe2#rolling-deployments">deployment process
of the rolling router</a> from Travis CI to Wercker.

The changes aren't big. The main difference is that whereas Travis CI uses Ubuntu shell environment to build and deploy 
the desired application Wercker uses any Docker "box" as the base image and environment for the build and deploy process.

To support the utilities required by the original script like curl, jq and recode we've also chosen Ubuntu as the "box" for
our application and it's build and deploy process by Wercker.

The first thing to do is to build our Node.js application image on top of the Ubuntu image using 
<a href="https://github.com/mikarinneoracle/dockernode-app/blob/master/Dockerfile">this Dockerfile</a>.
As you can see we are using Wercker's source directory `/pipeline/source<` as the `WORKDIR`.
