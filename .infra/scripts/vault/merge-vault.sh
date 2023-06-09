#!/bin/bash

set -e

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly VAULT_FILE="${SCRIPT_DIR}/../../vault/vault.yml"

ancestor_version=$1
current_version=$2
other_version=$3
conflict_marker_size=$4
merged_result_pathname=$5

ancestor_tempfile=$(mktemp vault-tmp-ancestor.XXXXXXXXXX)
current_tempfile=$(mktemp vault-tmp-current.XXXXXXXXXX)
other_tempfile=$(mktemp vault-tmp-other.XXXXXXXXXX)

delete_tempfiles() {
  rm -f "$ancestor_tempfile" "$current_tempfile" "$other_tempfile"
}
trap delete_tempfiles EXIT

ansible-vault decrypt --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh" --output "$ancestor_tempfile" "$ancestor_version"
ansible-vault decrypt --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh" --output "$current_tempfile" "$current_version"
ansible-vault decrypt --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh" --output "$other_tempfile" "$other_version"

git --no-pager diff --no-index "$ancestor_tempfile" "$other_tempfile" || true
git merge-file "$current_tempfile" "$ancestor_tempfile" "$other_tempfile"

ansible-vault encrypt --vault-password-file="${SCRIPT_DIR}/get-vault-password-client.sh" --output "$current_version" "$current_tempfile"
