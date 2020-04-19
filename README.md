# Tohr

Thor is an attempt to be a prettier interface for transmission-daemon, more mobile
friendly.

It is also a way for me to improve my Angular, Node and Docker skills : feel free to give me some
advices, fork this project or post issues.


## Features
- List all torrents of transmission-daemon
- Upload a *.torrent file with optionnal path destination
- See details of a torrent
- Move and delete a torrent and its data
- Monitoring page : see CPU, memory and disk usage

![](demo-tohr.gif)


## Getting started
### requirements
- Node : https://nodejs.org/en/download/ : all the project is based on JavaScript and TypeScript
- Angular cli : https://cli.angular.io/ : in order to have commands to build and run front-end
- Docker : https://www.docker.com/ : used to run dev and production environment automaticaly


### Installation 

```bash
# getting sources and dependencies
git clone git@github.com:cyril-colin/tohr.git
cd tohr
npm install
# Transmission configuration
mkdir -p transmission-data/config transmission-data/data/films transmission-data/data/musics transmission-data/data/series transmission-data/data/other
cp back/config/transmission-settings.json transmission-data/config/settings.json

# Tohr configuration
cp back/config/config.sample.json back/config/config.dev.json
nano back/config/config.dev.json # Set users and transmission login settings.

# Run
docker-compose up -d # start the backend with a connected transmission
npm start # start the front
docker-compose logs -f tohr-dev
  
```

#### Production mode

```bash
mkdir tohr && cd tohr

VERSION="1.0.3-SNAPSHOT-4"
SOURCE="https://github.com/cyril-colin/tohr/tree/${VERSION}"
# Tohr config
curl -o docker-compose.yml ${SOURCE}/docker-compose-prod.yml
vi docker-compose.yml # Update config to your needs
curl -o config.production.json ${SOURCE}/back/config/config.sample.json
vi config.production.json # Update config to your needs

# Transmission config
mkdir -p transmission-data/config transmission-data/data/films transmission-data/data/musics transmission-data/data/series transmission-data/data/other
curl -o transmission-data/config/settings.json ${SOURCE}/back/config/transmission-settings.json
vi transmission-data/config/settings.json # Change user password

# Run
docker-compose up -d
```



