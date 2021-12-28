


@Library('kibo-pipeline-shared-lib')_

ngProjectPipeline (
	FAIL_ON_TEST_FAILURE: false,
	SUPPORTS_NUGET: false,
	SCALE_UNITS: ['sb'],
    DOCKER_IMAGE : 'oms/classic-email-service',
    DOCKER_REPO: '542216209467.dkr.ecr.us-east-1.amazonaws.com',
    DOCKERFILE : './Dockerfile',
    KUBE_TARGET_PORT :'3000',
    KUBE_SERVICE_PORT : '80',
    KUBE_SERVICE_NAME :'oms-classic-email-service',
    KUBE_TEMPLATE_FILE : 'com/kibo/kubernetes/ng-web-service.yml',
    INGRESS_HOST_PREFIX: 'oms-classic-email-service',
    INGRESS_REWRITE_TARGET: '/',
    INGRESS_PATH_MATCH: '/',
    CONFIG_MAPS: ['kibo-default-env-configmap','kibo-hp-routes-configmap','kibo-tp-routes-configmap','kibo-ext-services-configmap']
    );