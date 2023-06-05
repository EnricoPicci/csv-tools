# csv-tools

Provides a set of functions to turn objects to csv records and viceversa.

Examples of usage can be found in the `*.spec.ts` test files.

## Installation

npm i @enrico.piccinin/csv-tools

## From csv to objects

There are functions to convert:

-   an array of strings representing csv records to an array of objects
-   a stream of strings (typically lines coming from a csv file) to a stream of objects

## From objects to csv

There are functions to convert:

-   an array of objects to an array of strings representing csv records
-   a stream of objects to a stream of strings representing csv records

## test

Run the tests using the command

`npm run test`

## Miscellanea

csv-tools is a node app configured to use Typescript scaffolded using the package `@enrico.piccinin/create-node-ts-app`.

csv-tools can be published as a package on the public NPM registry.

Contains a configuration for `eslint` and `prettier`.

Testing is based on the `mocha` and `chai` libraries.
