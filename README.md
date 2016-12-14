# Git repositories api

Helpers for working with Git repositories 

## Building
  * Clone the repository 
  * Run `npm install`

## Docs

### isFileExists(repo_owner,repo_name,file_path)

An endpoint that will be able to check if a specific file (full path) exists in a specific repository.

`repo_owner` - The string of repository owner.

`repo_name` - The string of repository name.

`file_path` - The string of file path to validate.

Returns `true` if the file exists, `false` if there is no file on repository.

### getFilesByName(repo_owner,repo_name,file_name)

An endpoint that will be able to recursively check if specific file exists somewhere in a specific repository.

`repo_owner` - The string of repository owner.

`repo_name` - The string of repository name.

`file_name` - The string of file name to validate.

Returns an array of existing files paths, May be empty array if there is no existing files.

### getYamlFiles(repo_owner,repo_name)

 An endpoint that will be able to recursively check and find all 'yaml' files in a specific repository.

`repo_owner` - The string of repository owner.

`repo_name` - The string of repository name.

Returns an array of yaml files paths, May be empty array if there is no yaml files.