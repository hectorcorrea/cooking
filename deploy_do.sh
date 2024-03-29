#!/bin/bash
echo "Compiling Linux version..."
env GOOS=linux go build

echo "Creating tarball..."
tar -czvf cooking.tar.gz \
  cooking \
  views/* \
  public/* 

echo "Copying to the remote server"
scp cooking.tar.gz ubuntu20:.

echo "Done."

# From here, login to the remote server, stop the running service,
# untar the file (tar -xzvf cooking.tar.gz -C ./cooking/)
# and restart the service.
