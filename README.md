# Tohr

Thor is an attempt to be a prettier interface for transmission-daemon, more mobile
friendly.

It is also a way for me to improve my Angular and Node skills : feel free to give me some
advices, fork this project or post issues.

The current repository is only for the frontend. Please, checks these repositories too :
- The backend : https://github.com/cyril-colin/tohr-back
- The getting started project : https://github.com/cyril-colin/tohr-getting-started

## Features

- List all torrents of transmission-daemon
- Upload a *.torrent file with optionnal path destination
- See details of a torrent
- Move and delete a torrent and its data
- Monitoring page : see CPU, memory and disk usage

## Getting started
### requirements
- Node : https://nodejs.org/en/download/ : all the project is based on JavaScript and TypeScript
- Angular cli : https://cli.angular.io/ : in order to have commands to build and run front-end
- Virtualbox : https://www.virtualbox.org/ : I use virtualbox with vagrant.
- Vagrant : https://www.vagrantup.com/downloads.html : Vagrant is used to virtualize the backend, with a
transmission-daemon installed in order to test communication between backend and transmission-daemon.

### Installation 
```bash
# Create a dedicate directory for repositories.
mkdir tohr && cd tohr
git clone git@github.com:cyril-colin/tohr-getting-started.git
git clone git@github.com:cyril-colin/tohr-back.git
git clone git@github.com:cyril-colin/tohr-front.git

# Download all dependencies of back and front
(cd tohr-back && npm install)
(cd tohr-back && cp config/config.sample.json config/config.json)
(cd tohr-front && npm install)

# Create and run the backend environment
cd tohr-getting-started
vagrant up
vagrant ssh
cd /tohr && node_modules/.bin/ts-node-dev server.ts --config './config/config.json'

# In an other terminal, run the front end.
cd tohr-front
npm start

# Now, dev application should be available at http://localhost:4200
# Use "test" for login and password.
```



