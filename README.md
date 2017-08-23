# ngMaterial
[![Build Status](https://travis-ci.org/stephenst/angular-ngrx-material-starter.svg?branch=master)](https://travis-ci.org/stephenst/angular-ngrx-material-starter)
Check out [Demo & Documentation](http://stephenst.github.io/angular-ngrx-material-starter/)

 
## Features

* custom themes support (3 themes included)
* lazy-loading of feature modules
* lazy reducers
* localStorage ui state persistence
* `@ngrx/effects` for API requests
* fully responsive design
* angular-material and custom components in `SharedModule`
 
## Stack

* Angular
* ngrx
* Angular Material
* Bootstrap 4 (only reset and grids)

## Build

Built with [Angular CLI](https://github.com/angular/angular-cli)

## Build docker image

```
$ docker build -t ngmaterial . 
```

## Run the container

```
$ docker run -d -p 8080:80 ngmaterial
```


The app will be available at http://localhost:8080

You can easily tweak the nginx config in ```nginx/default.conf```
