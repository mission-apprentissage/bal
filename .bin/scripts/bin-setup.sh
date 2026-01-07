#!/usr/bin/env bash

set -euo pipefail

sudo ln -fs "${ROOT_DIR}/.bin/mna-bal" /usr/local/bin/mna-${PRODUCT_NAME}

sudo mkdir -p /usr/local/share/zsh/site-functions
sudo ln -fs "${ROOT_DIR}/.bin/zsh-completion" /usr/local/share/zsh/site-functions/_mna-${PRODUCT_NAME}
sudo rm -f ~/.zcompdump*
