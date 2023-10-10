tmpdir  := `mktemp`
export PATH := "./node_modules/.bin:" + env_var('PATH')
set dotenv-load

export PNPM := `which pnpm`

install:
    ${PNPM} install

dev: install
    ${PNPM} astro dev

check: install
    ${PNPM} astro check;
    ${PNPM} tsc --noEmit;

build: install
    ${PNPM} astro build

