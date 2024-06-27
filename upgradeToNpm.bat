@echo off

REM 执行构建
call yarn build

REM 使用 node 加载更改 package.json 中的版本
for /f %%i in ('node -p "require('./package.json').version.split('.').map((v, i) => i < 2 ? v : Number(v) + 1).join('.')"' ) do (
  set NEW_VERSION=%%i
)

CALL node -e "let pkg=require('./package.json'); pkg.version='%NEW_VERSION%'; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

REM 发布到 npm
call npm publish
