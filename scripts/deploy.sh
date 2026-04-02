#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-node-app}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

kubectl apply -f k8s/base/namespace.yaml
kubectl apply -f k8s/base/rbac.yaml
kubectl apply -f k8s/base/app-deployment.yaml
kubectl apply -f k8s/base/app-service.yaml
kubectl apply -f k8s/security/network-policy.yaml
kubectl apply -f k8s/scaling/hpa.yaml