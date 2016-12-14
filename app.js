var express = require('express');
var request = require('request');
var util = require('util');
var path = require('path')

var app = express();
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.status(200).json({sucess : true});
});

app.get('/isFileExists', function (req, res) {
  isFileExists(req, res);
});

app.get('/getFilesByName', function (req, res) {
  getFilesByName(req, res);
});

app.get('/getYamlFiles', function (req, res) {
  getYamlFiles(req, res);
});

function isFileExists(req, res){
    console.log("req.params: " + util.inspect(req.query));
    if(typeof req === 'undefined' || typeof req.query === 'undefined' || typeof req.query.repo_owner === 'undefined' || typeof req.query.repo_name === 'undefined' || typeof req.query.file_path === 'undefined'){
        console.log("Failed to check if file exists");
        res.status(500).json({error : "Failed to check if file exists, required params: [repo_owner, repo_name, file_path]"});
    } else {
        var url = util.format('https://api.github.com/repos/%s/%s/contents/%s', req.query.repo_owner,req.query.repo_name, req.query.file_path);
        sendRequest(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                 res.status(200).json({sucess : true});
             } else {
                res.status(200).json({sucess : false});
             }
        });
    }
};

function getFilesByName(req, res) {
    console.log("req.params: " + util.inspect(req.query));
    if(typeof req === 'undefined' || typeof req.query === 'undefined' || typeof req.query.repo_owner === 'undefined' || typeof req.query.repo_name === 'undefined' || typeof req.query.file_name === 'undefined'){
        console.log("Failed to check if files exists");
        res.status(500).json({error : "Failed to check if files exists, required params: [repo_owner, repo_name, file_name]"});
    } else {
        var url = util.format('https://api.github.com/repos/%s/%s/git/trees/master?recursive=1', req.query.repo_owner,req.query.repo_name);    
        sendRequest(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    var response_body = JSON.parse(response.body);
                    var tree = response_body["tree"];
                    var existing_files = [];
                    for(var element of tree){
                        var file_path = element["path"];
                        var file_name = path.basename(file_path);
                        if(element["type"] == "blob" && file_name === req.query.file_name){
                            existing_files.push(file_path);
                        }
                    }
                    res.status(200).json({sucess : true, existing_files : existing_files});
                } catch (err) {
                    console.log(util.format('error: %s', err.message));
                    res.status(500).json({sucess : false, error : err.message});
                }
             } else {
                res.status(500).json({sucess : false});
             }
        });
    }
};

function getYamlFiles(req, res) {
    console.log("req.params: " + util.inspect(req.query));
    if(typeof req === 'undefined' || typeof req.query === 'undefined' || typeof req.query.repo_owner === 'undefined' || typeof req.query.repo_name === 'undefined'){
        console.log("Failed to get yaml files paths");
        res.status(500).json({error : "Failed to get yaml files paths, required params: [repo_owner, repo_name]"});
    } else {
        var url = util.format('https://api.github.com/repos/%s/%s/git/trees/master?recursive=1', req.query.repo_owner,req.query.repo_name);    
        sendRequest(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    var response_body = JSON.parse(response.body);
                    var tree = response_body["tree"]
                    var yaml_files = [];
                    for(var element of tree){
                        var file_path = element["path"];
                        var file_extension = path.extname(path.basename(file_path));
                        if(element["type"] == "blob" && file_extension === ".yaml"){
                            yaml_files.push(file_path);
                        }
                    }
                    res.status(200).json({sucess : true, yaml_files : yaml_files});
                } catch (err) {
                    console.log(util.format('error: %s', err.message));
                    res.status(500).json({sucess : false, error : err.message});
                }
             } else {
                res.status(500).json({sucess : false});
             }
        });
    }
};

function sendRequest(url, callback){
    request(url, {'headers': {'User-Agent': 'request'}}, callback);
};

app.listen(3004, function () {
  console.log('Code-fresh app listening on port 3004!');
});