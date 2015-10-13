FoodPoints+
====
[![Build Status](https://travis-ci.org/howardchung/foodpoints.svg?branch=master)](https://travis-ci.org/howardchung/foodpoints)
[![Dependency Status](https://david-dm.org/chronologos/forkpoints.svg)](https://david-dm.org/chronologos/forkpoints)

About
====
An application for tracking food points of Duke University students.  

Dependencies
====
* Node.js
* MongoDB
* Redis

Sample Data
====
Dumps existing db, creates and loads sample data, runs queries.
* `mongo foodpoints sample.js > sample.out`

Deployment
====
* Install MongoDB and Node.js
* Put appropriate API keys in .env
* `npm install`
* `npm start`
