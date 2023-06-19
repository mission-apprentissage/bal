# BAL

## Installation

### Pré-requis

- Docker 19.03.0+
- GPG

### GPG

Pour décrypter les variables d'environnement, vous devez avoir une clé GPG, si ce n'est pas le cas, vous pouvez en créer en suivant la documentation Github https://docs.github.com/fr/authentication/managing-commit-signature-verification/generating-a-new-gpg-key

Choisir les choix suivants:

- `Please select what kind of key you want` > `ECC (sign and encrypt)`
- `Please select which elliptic curve you want` > `Curve 25519`
- `Please specify how long the key should be valid` > `0`
- `Real Name`: `<Prenom> <Nom>`
- `Email Address`: `email@mail.gouv.fr`

Une fois terminé, vous pouvez récupérer l'identifiant de votre clé via la commande suivante:

```bash
gpg --list-secret-keys --keyid-format=long
```

> L'identifiant de votre clé correspond à la valeur `sec ed25519/<identifiant>`

Afin qu'elle puisse être utilisée au sein
de la mission apprentissage, vous devez publier votre clé

```bash
gpg --send-key <identifiant>
```

Il est vivement conseillé de réaliser un backup des clés publique et privée qui viennent d'être créés.

```bash
gpg --export <identifiant> > public_key.gpg
gpg --export-secret-keys <identifiant> > private_key.gpg
```

Ces deux fichiers peuvent, par exemple, être stockés sur une clé USB.

Veuillez communiquer cette clé à votre équipe pour etre authorisé à décrypter le vault.

**Une fois habilité vous aurez accés aux fichiers suivants:**

- .infra/vault/.vault-password.gpg
- .infra/vault/habilitations.yml

### Variables d'environnement local

Pour récupérer les variables d'environnement localement veuillez lancer la commande:

```bash
.infra/scripts/vault/setup-local-env.sh
```

> Le script va vous demander à plusieurs reprise votre passphrase de votre clé GPG pour décrypter les variables d'environnment du vault.

### Démarrage

Pour lancer l'application :

```sh
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml`

L'application est ensuite accessible à l'url [http://localhost](http://localhost)

Pour update les dependencies:

```sh
make install
```

Pour lancer les tests localement:

```sh
make test
```

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
