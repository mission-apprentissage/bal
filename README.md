# BAL

### Pré-requis

- Docker 19+
- Docker-compose 1.27+

### Démarrage

Pour lancer l'application :

```sh
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml` et `docker-compose.override.yml`

L'application est ensuite accessible à l'url [http://localhost](http://localhost)

### Documentation API

La documentation API est générée par [fastify-swagger](https://github.com/fastify/fastify-swagger) et accessible à l'adresse `/api/documentation`.

### Convention de typage

Chaque route est typée au niveau de la requête et de la réponse. Les types sont définis dans le dossier `shared` pour une utilisation dans `ui` et `server`.

#### Nommage

- `S | I` pour Schema ou Interface
- `Req | Res` pour Request ou Response
- `Get | Post | Put | Patch | Delete` pour la méthode
- Nom du modèle

##### Exemple

- `SReqPostUser` pour le schema de la requête POST d'un `User`
- `SResPostUser` pour le schema de la réponse POST d'un `User`
- `IResGetUser` pour l'interface de la réponse GET d'un `User`
- `IResPostUser` pour l'interface de la réponse POST d'un `User`

![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)
