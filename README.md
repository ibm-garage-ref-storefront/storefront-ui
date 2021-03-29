##### storefront-ui

# Angular.JS Single Page Application with Node.JS backend

*This project is part of the `IBM Cloud Native Reference Architecture` suite, available at
https://cloudnativereference.dev/*

## Table of Contents

* [Introduction](#introduction)
* [Pre-requisites](#pre-requisites)
* [Running the application](#running-the-application)
    + [Get the storefront ui](#get-the-storefront-ui)
    + [Run the SonarQube Docker Container](#run-the-sonarqube-docker-container)
    + [Run the storefront ui](#run-the-storefront-ui)
    + [Validating the application](#validating-the-application)
    + [Exiting the application](#exiting-the-application)
* [Conclusion](#conclusion)
* [References](#references)

## Introduction

The sample Web application is built to demonstrate how to access the Omnichannel APIs. The application provides the basic function to allow user to browse the Catalog items, make an Order and review profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

Here is an overview of the project's features

- AngularJS SPA.
- Node.js based BFF application to access APIs.
- Authentication and Authorization through Keycloak.

## Pre-requisites

- [Docker](https://docs.docker.com/install/)

## Running the application

### Get the storefront ui

Clone the git repository as follows

```
$ git clone  https://github.com/ibm-garage-ref-storefront/storefront-ui
$ git checkout hp-quarkus-version
```

### Run the SonarQube Docker Container

Set up SonarQube for code quality analysis. This will allow you to detect bugs in the code automatically and alerts the developer to fix them.

```
docker run -d --name sonarqube -p 9000:9000 sonarqube
```

If it is successfully run, you will see something like this.

```
$ docker run -d --name sonarqube -p 9000:9000 sonarqube
1b4ca4e26ceaeacdfd1f4adaf892f041e4db19568ebfcc0b1961b4ca4e26ceae
```

### Run the storefront ui

- Go to `config` folder and change the `client_secret` to the one you grabbed earlier from keycloak in both the json files namely `default.json` (used for NODE_ENV development) and `production.json` (used for NODE_ENV production).

For details on how to access the keycloak client secret, refer this [doc](https://cloudnativereference.dev/related-repositories/keycloak/).

- Run the below command.

```
# Build storefront ui docker image
docker build -t storefront-ui .

# Start the Storefront UI Container in dev mode
docker run --name web \
  -e NODE_ENV=development \
  -p 3000:3000 \
  -d storefront-ui

# or

# Start the Storefront UI Container in production mode
docker run --name web \
  -p 3000:3000 \
  -d storefront-ui
```

### Validating the application

You can access the ui at http://localhost:3000.

![storefront ui](docs/static/storefront_ui.png?raw=true)

- To perform code quality checks, run the below commands.

Install sonarqube-scanner locally.

```
npm install sonarqube-scanner --save-dev
```

- Set the environment variables.

```
export SONARQUBE_URL=http://localhost:9000/
export SONARQUBE_USER=admin
export SONARQUBE_PASSWORD=admin
```

Now run sonar as follows.

```
npm run sonar
```

If it is successful, you will see something like this.

```
$ npm run sonar

> bluecompute-web@0.0.0 sonar /Users/Hemankita1/IBM/CN_Ref/Quarkus/storefront-ui
> node sonar-project.js -X

SERVER URLhttp://localhost:9000/
process.envhttp://localhost:9000/
[16:31:22] Starting analysis...
..........
..........
INFO: ANALYSIS SUCCESSFUL, you can browse http://localhost:9000/dashboard?id=bluecompute-web
INFO: Note that you will be able to access the updated dashboard once the server has processed the submitted analysis report
INFO: More about the report processing at http://localhost:9000/api/ce/task?id=AXh9peARGlc8bxlXLNn0
INFO: Analysis total time: 49.119 s
INFO: ------------------------------------------------------------------------
INFO: EXECUTION SUCCESS
INFO: ------------------------------------------------------------------------
INFO: Total time: 51.489s
INFO: Final Memory: 12M/47M
INFO: ------------------------------------------------------------------------
[16:32:15] Analysis finished.
```

- Now, access http://localhost:9000/, login using the credentials admin/admin, and then you will see something like below.

![UI SonarQube](docs/static/ui_sonarqube.png?raw=true)

![UI SonarQube details](docs/static/ui_sonarqube_details.png?raw=true)

### Exiting the application

Run the below command

```
docker stop <container_id>
```

## Conclusion

You have successfully developed and deployed the ui for storefront application.

## References
