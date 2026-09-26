A demonstration of Docker to implement a simple 3 tier architecture

* frontend will be able to access the mid-tier
* mid-tier will be able to access the db

In order to run this in docker, simply type ```docker-compose up``` at the command prompt. Docker will then create the [MongoDB](https://www.mongodb.com/) from the stock [mongo](https://hub.docker.com/_/mongo) image. The api uses [nodejs](https://nodejs.org/) with [express](http://expressjs.com/) and is built from a [node:alpine](https://hub.docker.com/_/node) image. The front end uses [ReactJS](https://reactjs.org/) and built from a [node:alpine](https://hub.docker.com/_/node) image.

## Publicación de imágenes

GitHub Actions construye y publica cada componente por separado en GitHub Container Registry (GHCR). Los tags deben tener tres números de versión separados por puntos:

| Tag de Git | Imagen publicada |
| --- | --- |
| `frontend-v0.0.1` | `ghcr.io/alecog/todolist-front:v0.0.1` |
| `backend-v0.0.1` | `ghcr.io/alecog/todolist-back:v0.0.1` |

Para publicar una versión, crea el tag sobre el commit que quieras construir y súbelo:

```bash
git tag frontend-v0.0.1
git push origin frontend-v0.0.1
```

Para el backend, usa `backend-v0.0.1` en ambos comandos. Cada workflow utiliza el Dockerfile de su directorio y el `GITHUB_TOKEN` para publicar en GHCR; no hace falta configurar una contraseña o token personal. El workflow rechaza tags con un formato distinto de `frontend-vX.Y.Z` o `backend-vX.Y.Z`.

### Despliegue en Kubernetes

Los manifests `k8s/web-deployment.yaml` y `k8s/api-deployment.yaml` usan inicialmente las imágenes `v0.0.1`. Primero publica los tags correspondientes y comprueba que ambos workflows hayan terminado correctamente. Después aplica los manifests:

```bash
kubectl apply -f k8s/namespace.yaml
cp k8s/mongo-credentials.example.yaml k8s/mongo-credentials.secret.yaml
# Edita k8s/mongo-credentials.secret.yaml con las credenciales reales.
kubectl apply -f k8s/mongo-credentials.secret.yaml
kubectl apply -f k8s/web-deployment.yaml -f k8s/api-deployment.yaml
```

El archivo de Secret local queda excluido de Git. Contiene `username`, `password` y `mongo-uri`: MongoDB recibe las dos primeras variables y la API recibe la URI completa mediante `MONGO_URI`. La URI incluye la contraseña, por lo que también debe ser un Secret; un ConfigMap no es apropiado. Si la contraseña contiene caracteres reservados en una URL, como `@`, `:`, `/`, `?`, `#` o `%`, usa su valor codificado para URL dentro de `mongo-uri`.

Cada versión nueva tiene su propio tag de imagen. Por ejemplo, después de publicar `frontend-v0.0.2`, cambia solo la imagen del deployment web a `ghcr.io/alecog/todolist-front:v0.0.2` en `k8s/web-deployment.yaml` y ejecuta `kubectl apply -f k8s/web-deployment.yaml`. Haz lo mismo con `k8s/api-deployment.yaml` para una versión nueva del backend. Publicar un tag de Git construye la imagen, pero no cambia automáticamente la versión desplegada en Kubernetes.

Si el paquete de GHCR es privado, configura un `imagePullSecret` en el namespace `kubernaizing` y referéncialo en los deployments para que el clúster pueda descargar las imágenes. Los paquetes públicos de GHCR se pueden descargar sin autenticación.
