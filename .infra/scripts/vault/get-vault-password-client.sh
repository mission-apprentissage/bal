#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function usage {
  echo "Usage: $0 [params...]"
  echo
  echo "Command line interface to view the vault password"
  echo "This file implements Ansible specifications third-party vault tools"
  echo "For more informations see https://docs.ansible.com/ansible/latest/user_guide/vault.html#storing-passwords-in-third-party-tools-with-vault-password-client-scripts"
  echo
  echo "   --vault-id <file>     Path to the custom vault password file"
  echo
  echo "Usage examples:"
  echo ""
  echo " View password from the default password file:"
  echo ""
  echo "      ./$0"
  echo ""
  echo " View password from a custom password file:"
  echo ""
  echo "      ./$0 --vault-id /path/to/file"
  echo ""
}

function main() {
  local vault_password_file="${SCRIPT_DIR}/../../vault/.vault-password.gpg"

  while [[ $# -gt 0 ]]; do
    params="$1"
    case $params in
    -? | --help)
      usage
      exit 0
      ;;
    --vault-id)
      if [[ $2 == "default" ]]; then
        vault_password_file="${SCRIPT_DIR}/../../vault/.vault-password.gpg"
      else
        vault_password_file="${SCRIPT_DIR}/../../vault/.vault-password-$2.gpg"
      fi
      shift
      shift
      ;;
    *)
      usage
      exit 1
      ;;
    esac
  done

  if test -f "${vault_password_file}"; then
    gpg --quiet --batch --use-agent --decrypt "${vault_password_file}"
  else
    #Allows to run playbooks with --vault-password-file even if password has not been yet generated
    echo "not-yet-generated"
  fi

  gpgconf --kill gpg-agent
}

DOCUMENT_CONTENT=$(op document get .vault-password-bal --vault "mna-vault-passwords-common")
vault_password_file="${SCRIPT_DIR}/../../vault/.vault-password.gpg"
previous_vault_password_file="${SCRIPT_DIR}/../../vault/.vault-password-previous.gpg"
readonly VAULT_FILE="${SCRIPT_DIR}/../../vault/vault.yml"

if [ ! -f "$vault_password_file" ]; then
    echo "$DOCUMENT_CONTENT" > "$vault_password_file"
    echo "vault password créé avec succès."

# Si le fichier existe et que son contenu est différent
elif [ "$DOCUMENT_CONTENT" != "$(cat "${vault_password_file}")" ]; then
    # Renommer l'ancien fichier
    mv "$vault_password_file" "$previous_vault_password_file"
    echo "vault-password existant renommé en .vault-password-previous.gpg."
    
    # Créer un nouveau fichier avec le contenu actuel
    echo "$DOCUMENT_CONTENT" > "$vault_password_file"
    echo "Nouveau vault-password créé avec succès."

    ansible-vault rekey \
    --vault-id "previous@${SCRIPT_DIR}/get-vault-password-client.sh" \
    --new-vault-id "default@${SCRIPT_DIR}/get-vault-password-client.sh" \
    "${VAULT_FILE}"

   rm "${previous_vault_password_file}"
fi


main "$@"
