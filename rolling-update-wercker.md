# Rolling update sticky sessions with Wercker

## Deploy the rolling update sticky sessions service

### Build the image 

Before building the `rolling-router-sticky-sessions` edit the file `.images/build/vars.mk` to set the name of your Docker-hub account to `REGISTRY_NAME`.

The run the make.

<pre>
cd ./images/rolling-router-sticky-sessions
make
</pre>


