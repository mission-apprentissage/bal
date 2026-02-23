## SOPS

Il est vivement recommander de stocker toutes les variables d'environnement sensibles (ex: token) des fichiers **SOPS**.

Les variables d'environnement sont réparties dans des fichiers spécifiques à chaque environnement :

- `.infra/env.global.yml` : variables d'environnement globales
- `.infra/env.production.yml` : environnement de production
- `.infra/env.recette.yml` : environnement de recette
- `.infra/env.preview.yml` : environnement de prévisualisation
- `.infra/env.local.yml` : environnement de développement local

Pour éditer les variables d'environnement d'un fichier **SOPS** :

```bash
  pnpm vault:edit <env>
```

### Variables des fichiers SOPS

```yaml
APP_VERSION: "1.0.0"
```

Pour y faire référence dans un fichier il suffit d'utiliser la syntaxe `{{ APP_VERSION }}`

Pour créer une variable spécifique à un environnement, le plus simple est d'ajouter le ficher **SOPS** `.infra/env.<env>.yml` spécifique à l'environnement.

```yaml
APP_ENV: "production"
```

Pour référencer cette variable dans un fichier, il faut utiliser la syntaxe `{{ APP_ENV }}`.

La variable `env_type` qui est définie dans le fichier `env.ini` sera automatiquement valorisée en fonction de l'environnement cible.

## SOPS git diff

Pour résoudre les conflits git sur les fichiers **SOPS**, il est possible de configurer git pour déchiffrer automatiquement les fichiers lors des diff.

Pour l'installer il faut exécuter les commandes suivantes

```bash
cat << 'EOF' >> ~/.gitconfig
[diff "sopsdiffer"]
  textconv = "sops decrypt"
EOF
```
