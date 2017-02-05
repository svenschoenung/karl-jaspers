#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

echo "Deleting old deployment directory"
sshpass -e ssh $SSHUSER@karl-jaspers.com "rm -rf /var/www/karl-jaspers.com-deploy"

echo "Copying deployment directory to server"
sshpass -e scp -r dist $SSHUSER@karl-jaspers.com:/var/www/karl-jaspers.com-deploy

echo "Running deployment script on server"
sshpass -e ssh $SSHUSER@karl-jaspers.com "./deploy.sh karl-jaspers.com"
