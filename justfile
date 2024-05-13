tmpdir  := `mktemp`
export PATH := "./node_modules/.bin:" + env_var('PATH')
export NODE_OPTIONS := '--max_old_space_size=10240'
set dotenv-load

export PNPM := `which pnpm`

install:
    ${PNPM} install

dev: install
    ${PNPM} run dev

lint: 
    echo "ESLint server using NODE_OPTIONS: $NODE_OPTIONS"
    ${PNPM} eslint --debug --fix .

check: install lint
    ${PNPM} astro check;
    # ${PNPM} tsc -p tsconfig.node.json --noEmit;

build: install pre-build
    ${PNPM} tsc -p tsconfig.node.json
    ./bin/generalDetailsPages.sh
    ${PNPM} astro build

pre-build: install
    # ${PNPM} tsc -p tsconfig.node.json
