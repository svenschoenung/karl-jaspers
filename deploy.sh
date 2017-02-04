#!/usr/bin/env bash

exit 0

set -o errexit
set -o nounset
set -o pipefail

echo "Deleting old deployment directory"
sshpass -e ssh $SSHUSER@schoenung.org "rm -rf /var/www/karl-jaspers.com-deploy"

echo "Copying deployment directory to server"
sshpass -e scp -r dist $SSHUSER@schoenung.org:/var/www/karl-jaspers.com-deploy

echo "Running deployment script on server"
sshpass -e ssh $SSHUSER@schoenung.org "./deploy.sh karl-jaspers.com"
