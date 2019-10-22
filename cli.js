#!/usr/bin/env node
const cli = require("commander");
const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({region: 'us-east-1'});
const lambda = new AWS.Lambda();
cli
    .option("-n, --name [name]")
    .option("-f, --file [file]")
    .parse(process.argv);
if (cli.name && cli.file) {
    let file = fs.readFileSync(cli.file);
    var params = {
        FunctionName: cli.name,
        Publish: true,
        ZipFile: file
    };
    lambda.updateFunctionCode(params).promise().then(x => console.log(x)).catch(x => {
        console.error(x);
        throw x;
    });
} else {
    console.log("wrong parameters, see --help");
    process.exit(-1);
}
