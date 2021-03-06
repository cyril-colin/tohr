# Tohr

Tohr is an attempt to be a prettier interface for transmission-daemon, more mobile
friendly, and connected to a torrent provider in order to search files and download
them directly into specific directories such as "films", "series", "musics" and "other".

I need this because I think great tools as [Radarr](https://radarr.video/) or [Sonarr](https://sonarr.tv/)
are overkill for my needs. So I decided to make my own, easy to configure, alternative.

This web application is also a way for me to improve my Angular, Node and Docker skills : feel free to give me some
advices, fork this project or post issues.


## Features
- Search and download torrent from a configured provider in a linked [Jackett](https://github.com/Jackett/Jackett) instance
- Add a torrent file manually
- Download data in specific destination paths (usefull to send downloads into a [Plex](https://www.plex.tv/) category...)
- Manage [Transmission](https://hub.docker.com/r/linuxserver/transmission/) torrents : list, details, deletion
- Direct download files
- Monitoring page : disks spaces left, used memory...
- Installation with Docker and docker-compose
- Progressive Web App enabled


## Getting started
First of all, install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/).


### Prepare directories
First of all, prepare a directory to put in all your configuration.
Then choose your version, available on the [Tohr Docker Hub](https://hub.docker.com/r/coyotetuba/tohr) : 
```bash
mkdir tohr && cd tohr
# Prepare directories that will contains downloads and configuration
mkdir -p transmission-data/config \
  transmission-data/data/films \
  transmission-data/data/musics \
  transmission-data/data/series \
  transmission-data/data/other

VERSION="1.0.3-SNAPSHOT-6"
SOURCE="https://github.com/cyril-colin/tohr/tree/${VERSION}"
```


### Get and edit docker-compose.yml
Now you can get the docker-compose.yml sample from the github repository. This file will contains
```bash
curl -o docker-compose.yml ${SOURCE}/docker-compose-prod.yml
vi docker-compose.yml
```
Usual data to edit are :
  - ``tohr.image`` : the docker build tag. Available on [Tohr Docker Hub](https://hub.docker.com/r/coyotetuba/tohr)
  - ``tohr.ports`` : to fit to your environments
  - ``volume`` : to add your tohr configuration and assets
  - ``tohr-transmission.ports`` : idem, to fit to your needs. See transmission documentation
  - ``tohr-transmission.volumes`` : to fit to your downloads favorite destinations


### Get and edit Tohr configuration
```bash
curl -o config.production.json ${SOURCE}/back/config/config.sample.json
vi config.production.json
```
Usual data to edit are :
  - ``users`` : user and password to allow users to login.
  - ``jwtSecret`` : The secret to protect JWT
  - ``diskToWatch`` : The reference to a element of first column 
    of "df -h" command. This allow Tohr to check spaces left 
    on disks
  - ``transmissionDaemonLogin`` : The login to let Tohr access to
    transmission
  - ``transmissionDaemonPassword`` : The password to let Tohr access
    to transmission


### Get and configure Transmission configuration
```bash
curl -o transmission-data/config/settings.json ${SOURCE}/back/config/transmission-settings.json
vi transmission-data/config/settings.json
```
Usual data to edit are :
  - ``rpc-username`` : The user login for transmission. Should be the same as transmissionDaemonLogin in `config.production.json`
  - ``rpc-password`` : The user password for transmission. Should be the same as transmissionDaemonPassword in `config.production.json`
> Note : this file will be edited at the transmission start up in order to secure the password. Please see the [Transmission documentation](https://hub.docker.com/r/linuxserver/transmission/).

### Get and configure Jackett configuration
```bash
curl -o jackett/config/ServerConfig.json ${SOURCE}/back/config/jackett.sample.json
vi transmission-data/config/settings.json
```

### Finally, run Tohr !
```bash
docker-compose up -d
```
Now, go to http://localhost:9117 to access and configure Jackett in order to enable an indexer.

> UI will be available at the exposed docker-compose.yml port. By default : http://localhost:4201


#### Useful command
```bash
docker-compose logs -f tohr # Show tohr logs
docker-compose exec tohr bash # Open a terminal in the Tohr container
docker-compose down # Stop and destroy containers. It will keep downloaded files
```



## Development
First of all, install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/).
Install [Node](https://nodejs.org/en/download/) : all the project is based on JavaScript and TypeScript


```bash
# getting sources and dependencies
git clone git@github.com:cyril-colin/tohr.git
cd tohr
npm install


# Transmission configuration
mkdir -p transmission-data/config \
  transmission-data/data/films \
  transmission-data/data/musics \
  transmission-data/data/series \
  transmission-data/data/other
cp back/config/transmission-settings.json transmission-data/config/settings.json

# Configure jackett
docker-compose up -d jackett # http://localhost:9117 to access and configure Jackett in order to enable an indexer.
docker-compose down

# Run
cp back/config/config.sample.json back/config/config.dev.json # Edit with the jackett ApiKey
npm start # start back and front
docker-compose logs -f tohr-dev # to see the backend logs


npm run stop
rm -rf transmission-data/ jackett/
```




#### Build the production
```bash
npm run build # Check if build works
vi package.json # Update manually version
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]') &&\
 git add . && git commit -am ${VERSION} && \
 git tag -a ${VERSION} -m ${VERSION} 
git push --tags && git push
```


## External links

This application works thanks to the transmission-daemon RPC api and jackett :
- [Transmission api spécification](https://github.com/transmission/transmission/blob/master/extras/rpc-spec.txt)
- [Jackett](https://github.com/Jackett/Jackett)




