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
    # ${PNPM} tsc -p tsconfig.node.json --noEmit;

build: install pre-build
    ${PNPM} tsc -p tsconfig.node.json
    ./bin/generalDetailsPages.sh
    ${PNPM} astro build

pre-build: install
    # ${PNPM} tsc -p tsconfig.node.json
