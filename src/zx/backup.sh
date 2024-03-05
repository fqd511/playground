#!/usr/bin/env

#
# By 511 at 23/03/01/ Wed 15:46
# @Desc: for create monthly backup files, including:
# * Brewfile
# * .zshrc
# * bitwarden [manually]
# * GoogleAuthenticator [manually]
#


echo "$(date +"%Y-%m-%d %H:%M:%S") : Start backup"

# create local backup files under /Downloads
date=$(date +'%Y-%m-%d')

cd ~/Downloads

rm -rf ${date}

mkdir ${date}

cd ${date} 

cp ~/.zshrc ~/Downloads/${date}/.zshrc

brew bundle dump --file=~/Downloads/${date}/Brewfile

echo 'brew file created'

# backup dotfiles to github
cd ~
rm Brewfile
brew bundle dump

# 检测一下有没有 Raycast 备份文件

# 使用shopt -s nullglob保留未匹配的文件列表
shopt -s nullglob
# files=(*)直接获取一级目录下文件
files=(*) 

has_raycast_backup_file=false
# "${files[@]}"循环遍历文件列表
for file in "${files[@]}"; do
  if [[ $file = *".rayconfig" ]]; then
    has_raycast_backup_file=true
    break
  fi
done

if ! $has_raycast_backup_file; then
  echo "当前一级目录下没有 Raycast 备份文件"
  exit 1
fi

./backupDotfiles.sh

echo 'dotFile created'

echo "$(date +"%Y-%m-%d %H:%M:%S") : Finish backup"
say '备份成功'