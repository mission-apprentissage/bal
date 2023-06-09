# Infrastructure

- [Infrastructure](#infrastructure)
  - [Prérequis](#prérequis)
    - [SSH](#ssh)
    - [GPG](#gpg)
  - [Configuration et déploiement d'un environnement](#configuration-et-déploiement-dun-environnement)
  - [Vault](#vault)
    - [Création du vault](#création-du-vault)
    - [Edition du vault](#edition-du-vault)
    - [Variables du vault](#variables-du-vault)
  - [Habilitations](#habilitations)
    - [Ajout d'un utilisateur](#ajout-dun-utilisateur)
    - [Suppression d'un utilisateur](#suppression-dun-utilisateur)
  - [Modification d'un environnement](#modification-dun-environnement)
    - [Ajouter un disque de sauvegarde externe](#ajouter-un-disque-de-sauvegarde-externe)
    - [Notifications Slack](#notifications-slack)
  - [Création d'un nouvel environnement](#création-dun-nouvel-environnement)
    - [Création du VPS OVH](#création-du-vps-ovh)
    - [Déclaration de l'environnement](#déclaration-de-lenvironnement)
    - [Configuration de l'environnement](#configuration-de-lenvironnement)
  - [Tester les playbook Ansible](#tester-les-playbook-ansible)

## Prérequis

Contient l'ensemble des données sensibles nécessaires à la mise en place de
l'application.

- Ansible 2.7+: `brew install ansible`
- sshpass
  ```
  brew tap esolitos/ipa
  brew install esolitos/ipa/sshpass
  ```

**Fichier disponible seulement aux personnes habilitées**

- .vault-password.gpg
- habilitations.yml

### SSH

Pour utiliser le projet infra, vous devez avoir une clé SSH, si ce n'est pas le cas, vous pouvez suivre le tutorial
suivant : https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### GPG

Veuillez suivre les instructions dans le [root README](../README.md#gpg)

## Configuration et déploiement d'un environnement

Pour configurer un environnement, il faut lancer la commande suivante :

```
bash scripts/setup-vm.sh <nom_environnement> --user <nom_utilisateur>
```

Il est possible de mettre à jour et déployer uniquement la partie applicative de l'application en lançant le script

```
bash scripts/deploy-app.sh <nom_environnement> --user <nom_utilisateur>
bash scripts/deploy-app.sh <nom_environnement> --extra-vars=app_version=<app_image_version> --user <nom_utilisateur>
```

Pour information si votre utilisateur local porte le même nom que l'utilisateur distant alors `--user` n'est pas
nécessaire.

## Push des images Docker sur le registre GitHub

Pour pousser les images Docker de l'application (Reverse Proxy et App) sur le registre GitHub (https://ghcr.io/mission-apprentissage/), vous pouvez utiliser le script "push-image" :

```bash
bash scripts/push-image.sh
```

Le script vous demandera si vous souhaitez créer et pousser les images pour "Reverse Proxy" et "App". Pour chaque image, il vous proposera automatiquement la prochaine version patch selon le versioning sémantique, mais vous pourrez également saisir une version personnalisée si vous le souhaitez.

Après avoir sélectionné les versions, le script vous demandera de confirmer vos choix. Ensuite, il vous demandera vos identifiants GitHub (nom d'utilisateur et token personnel) pour se connecter au registre Docker.

Une fois connecté, le script construira et poussera les images Docker locales sur le registre GitHub en utilisant les versions sélectionnées.

Note : Si vous ne souhaitez pas créer et pousser une image particulière, vous pouvez simplement répondre "n" lorsque le script vous le demande.

## Vault

Il est vivement recommander de stocker toutes les variables d'environnement sensibles (ex: token) dans un vault Ansible.
Le fichier `vault/vault.yaml` contient déjà les données jugées sensibles.

### Création du vault

Dans un premier temps, vous devez générer le mot de passe du vault. Ce mot de passe sera chiffré via GPG et pourra
uniquement être obtenu par les personnes listées dans le fichier `vault/habilitations.yml`

Pour se faire, lancez la commande suivante :

```bash
  bash scripts/vault/generate-vault-password.sh
```

Cette commande va créer le fichier `vault/.vault-password.gpg`, vous devez le commiter.

Le mot de passe contenu dans ce fichier va permettre de chiffrer le ficihier `vault.yml`. Pour se
faire, il faut lancer la commande suivante :

```bash
  bash scripts/vault/encrypt-vault.sh
```

Le script va utiliser votre clé GPG et probablement vous demander votre passphrase. Il va ensuite chiffrer le
fichier `vault/vault.yml`.

```yaml
$ANSIBLE_VAULT;1.2;AES256;mnaprojectname_ansible_secret
3566.....
....
```

Vous devez commiter le fichier chiffré.

### Edition du vault

Si vous voulez éditer le vault, le plus simple est d'utiliser un plugin pour votre IDE

- vscode : [https://marketplace.visualstudio.com/items?itemName=dhoeric.ansible-vault]()
- intellij idea : [https://plugins.jetbrains.com/plugin/14278-ansible-vault-editor]()

Quand vous allez ouvrir le fichier, un mot de passe vous sera demandé. Pour l'obtenir, executez la commande suivante

```bash
  bash scripts/vault/get-vault-password-client.sh
```

Vous pouvez également éditer directement le fichier en ligne de commande sans afficher en clair le mot de passe :

```bash
   EDITOR=vim bash scripts/vault/edit-vault.sh vault/vault.yml
   ou
   EDITOR="code -w" bash scripts/vault/edit-vault.sh vault/vault.yml
```

### Variables du vault

Toutes les variables du vault sont préfixées par `vault`

```yaml
vault:
  APP_VERSION: "1.0.0"
  APP_ENV: "recette"
```

Pour y faire référence dans un fichier il suffit d'utiliser la syntaxe `{{ vault.APP_VERSION }}`

Pour créer une variable spécifique à un environnement, le plus simple est d'ajouter une section dans le vault :

```yaml
vault:
  APP_VERSION: "1.0.0"
  production:
    APP_ENV: "production"
  recette:
    APP_ENV: "recette"
```

Pour référencer cette variable dans un fichier, il faut utiliser la syntaxe `{{ vault[env_type].APP_ENV }}`
La variable `env_type` qui est définie dans le fichier `env.ini` sera automatiquement valorisée en fonction de
l'environnement cible.

### Résolution des conflits

Pour résoudre les conflits git sur le vault, il est possible de configurer git avec un mergetool custom. L'idée du custom merge tool est de décrypter le fichier pour appliquer le merge automatique de fichier.

Pour l'installer il faut exécuter les commandes suivantes

```shell
git config --local merge.ansible-vault.driver "./.infra/scripts/vault/merge-vault.sh %O %A %B %L %P"
git config --local merge.ansible-vault.name "Ansible Vault merge driver"
```

Ensuite lors du merge, vous serez invité à entrer votre passphrase (3 fois) pour décrypter les fichiers (distant, local et resultat). Il sera également affiché un le `git diff` dans le stdout.

```shell
git merge main
```

## Habilitations

### Ajout d'un utilisateur

Il est possible d'ajouter ou de supprimer des habilitations en éditant le
fichier `vault/habilitations.yml`. Tous les utilistateurs présents dans ce fichier pourront se
connecter aux environnements via leurs clés SSH. Ils pourront également accéder au vault et déchiffrer les backups des
environnements si une clé GPG est fournie.

Une habilitation doit être de la forme suivante :

```yml
- username: <nom de l'utilisateur sur l'environnement>
  name: <nom de la personne>
  gpg_key: <identifiant de la clé GPG> (optionnel)
  authorized_keys: <Liste des clés SSH> (il est possible de mettre une url github)
```

Une fois le fichier des habilitations mis à jour, vous devez renouveler le vault et relancer la configuration de
l'environnement.

```bash
  bash scripts/vault/renew-vault.sh
  bash scripts/setup.sh <nom_environnement> --user <nom_utilisateur>
```

### Suppression d'un utilisateur

Pour supprimer une personne des habilitations, il faut :

- enlever les informations renseignées à son sujet dans le fichier `vault/habilitations.yml`
- ajouter le username de la personne dans le fichier `ansible/roles/clean/tasks/main.yml`

Une fois ces fichiers mis à jour, vous devez renouveler le vault et lancer la commande de nettoyage :

```bash
  bash scripts/vault/renew-vault.sh
  bash scripts/clean.sh <nom_environnement> --user <nom_utilisateur>
```

## Modification d'un environnement

### Notifications Slack

Un mécanisme de banissement d'IP est mis en place dans le dossier :

- `ansible/roles/setup/files/fail2ban`

Pour en savoir plus sur le fail2ban et sa configuration : https://doc.ubuntu-fr.org/fail2ban.

Ce mécanisme se charge de notifier dans une channel Slack lorsqu'une IP est bannie ou débannie.

Pour mettre en place les notifications Slack il est nécessaire d'utiliser les Webhooks et de créer une chaine dédiée
dans votre espace de travail Slack.

Il vous faudra créer une application dans Slack et récupérer le lien de la Webhook, pour en savoir
plus : https://api.slack.com/messaging/webhooks.

Une fois le lien de la Webhook récupéré il faudra stocker l'information dans le vault (`SLACK_WEBHOOK_URL`).

## Création d'un nouvel environnement

## Création d'une app OVH

OVH Europe https://eu.api.ovh.com/createApp/

Conserver les informmations suivantes :

- Application Key
- Application Secret

### Création du VPS OVH

La première étape est de créer un VPS via l'interface d'OVH : https://www.ovhcloud.com/fr/vps/

Une fois le VPS créé, il est nécessaire de configurer le firewall en lançant la commande :

```sh
bash scripts/ovh/create-firewall.sh <nom de l'environnement> <app-key> <app-secret>
```

Lors de l'exécution de ce script, vous serez redirigé vers une page web vous demandant de vous authentifier afin de
générer un jeton d'api. Vous devez donc avoir un compte OVH ayant le droit de gérer les instances de la Mission
Apprentissage. Une fois authentifié, le script utilisera automatiquement ce jeton.

Quand le script est terminé, vous pouvez aller sur l'interface
OVH [https://www.ovh.com/manager/#/dedicated/ip](https://www.ovh.com/manager/#/dedicated/ip)
afin de vérifier que le firewall a été activé pour l'ip du VPS.

### Création du domaine name

Créer un domain name pour le nouvel environment https://admin.alwaysdata.com/record/?domain=69636 `bal-<nom de l'environnement>.apprentissage.beta.gouv.fr`

### Déclaration de l'environnement

Le fichier `/env.ini` définit les environnements de l'application. Il faut donc ajouter le nouvel environnement
dans ce fichier en renseignant les informations suivantes :

```
[<nom de l'environnement>]
<IP>
[<nom de l'environnement>:vars]
dns_name=bal-<nom de l'environnement>.apprentissage.beta.gouv.fr
host_name=bal-<nom de l'environnement>
update_sshd_config=true
env_type=recette
```

Pour information, vous pouvez obtenir l'adresse ip du vps en consultant les emails de
service : https://www.ovh.com/manager/dedicated/#/useraccount/emails

Editer le vault pour créer les env-vars liés à ce nouvel environnement (cf: [Edition du vault](#edition-du-vault))

### Configuration de l'environnement

Pour configurer l'environnement, il faut lancer la commande suivante :

```bash
ssh-keyscan <ip> >> ~/.ssh/known_hosts
bash scripts/setup-vm.sh <nom_environnement> --user ubuntu --ask-pass
```

L'utilisateur `ubuntu` est un utilisateur créé par défaut par OVH, le mot de passe de ce compte est envoyé par email à
l'administrateur du compte OVH et est également disponible dans les emails de
service : https://www.ovh.com/manager/dedicated/#/useraccount/emails

Une fois le script terminé, l'application est disponible à l'url qui correspond au `dns_name` dans le fichier `env.ini`

Pour finaliser le création de l'environnement, vous devez vous connecter pour initialiser votre utilisateur :

```
ssh <nom_utilisateur>@<ip>
```

Enfin pour des questions de sécurité, vous devez supprimer l'utilisateur `ubuntu` :

```
bash scripts/clean.sh <nom_environnement> --user <votre_nom_utilisateur>  --extra-vars "username=ubuntu"
```

### Deploiement de l'environnement

```
bash scripts/deploy-app.sh <nom_environnement> --user <nom_utilisateur>
```
