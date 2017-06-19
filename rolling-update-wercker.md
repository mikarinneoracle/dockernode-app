# Rolling update sticky sessions with Wercker

## Deploy the rolling update sticky sessions service

### Build the image 

Before building the `rolling-router-sticky-sessions` image edit the file `./images/build/vars.mk` and set the value `REGISTRY_NAME` to match your Docker-hub account.

The run `make`.

<pre>
cd ./images/rolling-router-sticky-sessions
make
</pre>


