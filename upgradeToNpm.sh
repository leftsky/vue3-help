#!/bin/bash

# 执行构建
yarn build

# 使用 node 加载更改 package.json 中的版本
NEW_VERSION=$(node -p "require('./package.json').version.split('.').map((v, i) => i < 2 ? v : Number(v) + 1).join('.')")

node -e "let pkg=require('./package.json'); pkg.version='$NEW_VERSION'; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

# 发布到 npm
npm publish
