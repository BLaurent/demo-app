BUILD=$1
VERSION=1.0.0.$BUILD
export http_proxy=http://sjc1intproxy01.crd.ge.com:8080/
export https_proxy=http://sjc1intproxy01.crd.ge.com:8080/
export no_proxy="localhost, 127.0.0.1, *.ge.com"

git config --global http.sslVerify "false"
git config --global http.proxy http://sjc1intproxy01.crd.ge.com:8080
git config --global https.proxy http://sjc1intproxy01.crd.ge.com:8080
npm config set proxy http://sjc1intproxy01.crd.ge.com:8080/
npm config set https-proxy http://sjc1intproxy01.crd.ge.com:8080/
npm config set strict-ssl false
rm -rf /root/.npm/*.lock.STALE
node -v
npm -v
npm config delete proxy
npm config delete https-proxy
npm config set registry http://GIS05808.devcloud.ge.com:9095
npm config delete registry

npm install
jspm cache-clear
jspm install
bower cache clean
bower install --force-latest


#Adding the build version number in the main.hanlder file for UI to show the build number
sed -i -e 's/##BUILDVERSION##/'${VERSION}'/g' ./public/index.html

#Run the code coverage using gulp test
gulp test:unit
if [ "$?" = "0" ]; then
	echo "unit test passed"
else
	echo "unit test failed"
	exit 1
fi


#Adding dist required by the Jenkins
gulp sass
gulp dist
cd dist
if [ "$?" = "0" ]; then
	echo "dist folder created and present"
else
	echo "dist folder not present. build failed"
	exit 1
fi
#zip needed by artifactory of jenkins
zip -r ../bxjoc-ui-microapp-$VERSION.zip *
cd ..
