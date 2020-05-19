###### storefront-ui

# Running Storefront UI on CP4Apps

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-garage-ref-storefront/refarch-cloudnative-storefront*

## Table of Contents

* [Introduction](#introduction)
* [Pre-requisites](#pre-requisites)
* [Storefront UI on CP4Apps](#storefront-ui-on-cp4apps)
    + [Get the Storefront UI](#get-the-storefront-ui)
    + [Application manifest](#application-manifest)
    + [Project Setup](#project-setup)
    + [Deploy the app using Kabanero Pipelines](#deploy-the-app-using-kabanero-pipelines)
      * [Access tekton dashboard](#access-tekton-dashboard)
      * [Create registry secrets](#create-registry-secrets)
      * [Create Webhook for the app repo](#create-webhook-for-the-app-repo)
      * [Deploy the app](#deploy-the-app)
* [Conclusion](#conclusion)

## Introduction

This Web application is built to demonstrate how to access the Omnichannel APIs hosted on Kubernetes Environment. The application provides the basic function to allow user to browse the Catalog items, make an Order and review profile. The Web application is built with AngularJS in Web 2.0 Single Page App style. It uses a Node.js backend to host the static content and implement the BFF (Backend for Frontend) pattern.

![UI Catalog](static/ui_catalog.png?raw=true)

Here is an overview of the project's features:
- AngularJS SPA.
- Node.js based BFF application to access APIs.
- Authentication and Authorization through OAuth 2.0.
- Uses [`Docker`](https://docs.docker.com/) to package application binary and its dependencies.

## Pre-requisites:

* [RedHat Openshift Cluster](https://cloud.ibm.com/kubernetes/catalog/openshiftcluster)

* IBM Cloud Pak for Applications
  + [Using IBM Console](https://cloud.ibm.com/catalog/content/ibm-cp-applications)
  + [OCP4 CLI installer](https://www.ibm.com/support/knowledgecenter/en/SSCSJL_4.1.x/install-icpa-cli.html)

* Docker Desktop
  + [Docker for Mac](https://docs.docker.com/docker-for-mac/)
  + [Docker for Windows](https://docs.docker.com/docker-for-windows/)

* Command line (CLI) tools
  + [oc](https://www.okd.io/download.html)
  + [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  + [appsody](https://appsody.dev/docs/getting-started/installation)

* To see the full functionality of the app, all the peer microservices should be up and running. Make sure you deploy [Inventory](https://github.com/ibm-garage-ref-storefront/inventory-ms-spring/blob/master/docs/CP4APPS.md), [Catalog](https://github.com/ibm-garage-ref-storefront/catalog-ms-spring/blob/master/docs/CP4APPS.md), [Customer](https://github.com/ibm-garage-ref-storefront/customer-ms-spring/blob/master/docs/CP4APPS.md), [Auth](https://github.com/ibm-garage-ref-storefront/auth-ms-spring/blob/master/docs/CP4APPS.md) and [Orders](https://github.com/ibm-garage-ref-storefront/orders-ms-spring/blob/master/docs/CP4APPS.md) microservices.

## Storefront UI on CP4Apps

### Get the Storefront UI

- Clone ui repository:

```bash
git clone https://github.com/ibm-garage-ref-storefront/storefront-ui.git
cd storefront-ui
```

### Application manifest

When you see the project structure, you should be able to find an `app-deploy.yaml`. This is generated as follows.

```
appsody deploy --generate-only
```

This generates a default `app-deploy.yaml` and on top of this we added necessary configurations that are required by the Web application.

### Project Setup

- Create a new project if it does not exist. Or if you have an existing project, skip this step.

```
oc new-project storefront
```

- Once the namespace is created, we need to add it as a target namespace to Kabanero.

Verify if kabanero is present as follows.

```
$ oc get kabaneros -n kabanero
NAME       AGE   VERSION   READY
kabanero   9d    0.6.1     True
```

- Edit the yaml file configuring kabanero as follows.

```
$ oc edit kabanero kabanero -n kabanero
```

- Finally, navigate to the spec label within the file and add the following targetNamespaces label.

```
spec:
  targetNamespaces:
    - storefront
```

### Deploy the app using Kabanero Pipelines

#### Access tekton dashboard

- Open IBM Cloud Pak for Applications and click on `Instance` section. Then select `Manage Pipelines`.

![CP4Apps](static/cp4apps_pipeline.png?raw=true)

- This will open up the Tekton dashboard.

![Tekton dashboard](static/tekton.png?raw=true)

#### Create registry secrets

- To create a secret, in the menu select `Secrets` > `Create` as below.

![Secret](static/secret.png?raw=true)

Provide the below information.

```
Name - <Name for secret>
Namespace - <Your pipeline namespace>
Access To - Docker registry>
username - <registry user name>
Password/Token - <registry password or token>
Service account - kabanero-pipeline
Server Url - Keep the default one
```

- You will see a secret like this once created.

![Docker registry secret](static/docker_registry_secret.png?raw=true)

#### Create Webhook for the app repo

- For the Github repo, create the webhook as follows. To create a webhook, in the menu select `Webhooks` > `Create webhook`

We will have below

![Webhook](static/webhook.png?raw=true)

Provide the below information.

```
Name - <Name for webhook>
Repository URL - <Your github repository URL>
Access Token - <For this, you need to create a Github access token with permission `admin:repo_hook` or select one from the list>
```

To know more about how to create a personal access token, refer [this](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

- Now, enter the pipeline details.

![Pipeline Info](static/pipeline_info.png?raw=true)

- Once you click create, the webhook will be generated.

![Web Webhook](static/webhook_web.png?raw=true)

- You can also see in the app repo as follows.

![Web Repo Webhook](static/webhook_web_repo.png?raw=true)

#### Deploy the app

Whenever we make changes to the repo, a pipeline run will be triggered and the app will be deployed to the openshift cluster.

- To verify if it is deployed, run below command.

```
oc get pods
```

If it is successful, you will see something like below.

```
$ oc get pods
NAME                                   READY   STATUS    RESTARTS   AGE
web-59bb746cf8-rcfvs                   1/1     Running   0          35m
```

- You can access the app as below.

```
oc get route
```

This will return you something like below.

```
$ oc get route
NAME                  HOST/PORT                                                                                                                      PATH   SERVICES              PORT       TERMINATION   WILDCARD
web                   web-storefront.csantana-demos-ocp43-fa9ee67c9ab6a7791435450358e564cc-0000.us-east.containers.appdomain.cloud                          web                   3000-tcp                 None
```

- Grab the route and hit it.

For instance it will be http://web-storefront.csantana-demos-ocp43-fa9ee67c9ab6a7791435450358e564cc-0000.us-east.containers.appdomain.cloud/#!/home

![Web UI](static/web_ui.png?raw=true)

## Conclusion

You have successfully deployed and tested the Web Microservice.

To see the Web application working in a more complex microservices use case, checkout our Microservice Reference Architecture Application [here](https://github.com/ibm-garage-ref-storefront/refarch-cloudnative-storefront).
