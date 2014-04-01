#/bin/bash
set -e
for api in alarm-api content-hub online-accounts runtime-api ; do
    echo $api
    cd $api/client
    mv ../../yuidoc-theme/partials/index.handlebars index.handlebars.orig
    cp index.handlebars ../../yuidoc-theme/partials/
    rm -rf ./docsbuild
    yuidoc -c yuidoc.json .
    mv index.handlebars.orig ../../yuidoc-theme/partials/index.handlebars
    cd ../..
done;
exit 0
