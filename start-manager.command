#!/bin/zsh
set -e
cd "${0:A:h}"
if [[ ! -x .venv/bin/python3 ]]; then
  python3 -m venv .venv
fi
if ! .venv/bin/python3 -c 'import reportlab, openpyxl, pypdf' >/dev/null 2>&1; then
  echo '首次启动：安装本地管理工具所需组件…'
  .venv/bin/python3 -m pip install --disable-pip-version-check -r tools/requirements.txt
fi
exec .venv/bin/python3 tools/site_manager.py
