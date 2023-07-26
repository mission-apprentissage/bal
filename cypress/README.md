# Comment utiliser le recorder de Google Chrome

Pour apprendre à utiliser le recorder de Google Chrome, veuillez consulter le lien suivant :
[Documentation officielle de Google Chrome](https://developer.chrome.com/docs/devtools/recorder/) (en anglais).

## Comment ajouter une condition de fin ou vérifier une valeur précise dans un élément de la page

1. Cliquez sur les trois points verticaux (⋮) de la dernière étape.
2. Sélectionnez "Add step after".
3. Changez le type d'événement de `waitForElement` à `change`.
4. Sélectionnez l'élément que vous souhaitez surveiller en utilisant le bouton représentant un curseur (situé à côté de `selectors`).
5. Modifiez la valeur de la propriété `value` de `Value` à `>CE QUE JE VEUX`. :warning: Il est INDISPENSABLE d'ajouter le symbole `>` devant la valeur souhaitée.

## Comment ajouter votre record dans le dépôt Git

1. Cliquez sur le bouton "Export" du Chrome Recorder.
2. Choisissez l'option "Export as JSON".
3. Créez une pull request sur Github dans le dossier `cypress/records/admin` ou `cypress/records/user`, en fonction des niveaux de droits nécessaires pour exécuter ce record.
4. Ajoutez le fichier JSON exporté à la pull request
5. Envoyer votre pull request
