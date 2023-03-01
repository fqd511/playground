#!/usr/bin/env

#
# By 511 at 23/03/01/ Wed 15:46
# @Desc: for create monthly backup files, including:
# * Brewfile
# * .zshrc
# * bitwarden [manually]
# * GoogleAuthenticator [manually]
#

date=$(date +'%Y-%m-%d')

cd ~/Downloads

mkdir ${date}

cd ${date}

mkdir GoogleAuthenticator

cp ~/.zshrc ~/Downloads/${date}/.zshrc

brew bundle dump --file=~/Downloads/${date}/Brewfile
