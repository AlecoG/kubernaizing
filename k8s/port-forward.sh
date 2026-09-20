#!/bin/bash

echo "Port forwarding to ingress-nginx-controller service on port 8080"
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80