# BAL - Boite Aux Lettres

## Fiche Produit

Consultez la [Fiche Produit](https://www.notion.so/mission-apprentissage/Fiche-produit-73bbd7e5983749b7974c2f7c11194518?pvs=4) pour plus d'informations sur le projet.

## Installation

### Pré-requis

Avant d'installer le projet, assurez-vous d'avoir les éléments suivants :

- Docker 23.03.0+
- GPG
- NodeJS 18+ (vous pouvez utiliser [n](https://github.com/tj/n#third-party-installers) pour l'installer)

### Clé GPG

Pour décrypter les variables d'environnement, vous avez besoin d'une clé GPG. Si vous n'en avez pas, vous pouvez en créer une en suivant la documentation GitHub [ici](https://docs.github.com/fr/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

Voici les étapes pour créer votre clé GPG :

1. Lors de la création de la clé, choisissez les options suivantes :

   - `Please select what kind of key you want` > `ECC (sign and encrypt)`
   - `Please select which elliptic curve you want` > `Curve 25519`
- `Please specify how long the key should be valid` > `0`
   - `Real Name`: `<Prenom> <Nom>`
   - `Email Address`: `email@mail.gouv.fr`

2. Pour utiliser votre clé au sein du projet, publiez-la en exécutant la commande suivante :

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

   L'identifiant de votre clé correspond à la valeur `sec ed25519/<identifiant>`.

3. Pour utiliser votre clé au sein de la mission apprentissage, vous devez la publier en exécutant la commande suivante :

   ```bash
   gpg --send-key <identifiant>
   ```

4. Pour une meilleure sécurité, il est recommandé de sauvegarder les clés publique et privée nouvellement créées. Vous pouvez les exporter en exécutant les commandes suivantes :

   ```bash
   gpg --export <identifiant> > public_key.gpg
   gpg --export-secret-keys <identifiant> > private_key.gpg
   ```

   Ces deux fichiers peuvent être sauvegardés, par exemple, sur une clé USB.

5. Communiquez votre clé à votre équipe afin d'être autorisé à décrypter le vault.

**Une fois autorisé, vous aurez accès aux fichiers suivants :**

- `.infra/vault/.vault-password.gpg`
- `.infra/vault/habilitations.yml`

### Variables d'environnement local

Pour récupérer les variables d'environnement localement, veuillez exécuter la commande suivante :

```bash
.infra/scripts/vault/setup-local-env.sh
```

Le script vous demandera plusieurs fois la phrase secrète de votre clé GPG pour décrypter les variables d'environnement du vault.

## Développement

### Installation des dépendances

Avant de lancer l'application, assurez-vous d'installer toutes les dépendances nécessaires en exécutant la commande suivante :

```sh
yarn install
```

Cette commande mettra à jour les dépendances du projet.

> **Note** : Pour que vos changements se reflètent dans votre application locale, vous devez exécuter la commande `make start`.

### Lancement de l'application

Pour démarrer l'application en mode local, exécutez la commande suivante :

```sh
make start
```

Cette commande démarre les containers définis dans le fichier `docker-compose.yml`.

Une fois l'application démarrée, vous pourrez y accéder via l'URL [http://localhost](http://localhost)

### Exécution des tests

Pour exécuter les tests localement, utilisez la commande suivante :

```sh
yarn test
```

Cette commande exécutera tous les tests du projet et vous affichera les résultats.

**Assurez-vous:**

1. D'avoir installé toutes les dépendances via la commande `yarn install` avant de lancer les tests

2. D'avoir lancé l'application car les tests utilisent la base de donnée.

### Aller plus loin

Pour plus de details concernants le développement de l'application, veuillez consulter la documentation [developping](./docs/developping.md)

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
