#!/usr/bin/env bash

set -euo pipefail

sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-bal

sudo mkdir -p /usr/local/share/zsh/site-functions
sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-bal
sudo rm -f ~/.zcompdump*
