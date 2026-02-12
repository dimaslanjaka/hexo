@echo off
echo Starting Hexo clean and generate with verbose and debug logging...
call yarn workspace hexo-site exec "hexo clean --verbose --debug" > hexo-clean.log 2>&1
echo log generated at "%CD%\hexo-clean.log"
call yarn workspace hexo-site exec "hexo generate --verbose --debug" > hexo-generate.log 2>&1
echo log generated at "%CD%\hexo-generate.log"
