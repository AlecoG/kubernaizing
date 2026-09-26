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
