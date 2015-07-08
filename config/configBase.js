module.exports = {
	"server" : {
		"protocol" : "http",
		"uri" : "",
		"host" : "127.0.0.1",
		"port" : 2121,
		"sessionSecret" : "changeme"
	},
	"github" : {
		"clientId" : "",
		"clientSecret" : ""
	},
	"base" : {
		"publicDir" : "public",
		"templatesDir" : "public/templates",
		"partialsDir" : "public/templates/partials"
	},
	"aws" : {
		"config" : {
			"accessKeyId"		: "", 
			"secretAccessKey"	: "",
			"region"			: "us-east-1",
			"apiVersions"		: {
				"s3"		: "2006-03-01"
			}
		},
		// 6 MiB
		//
		"maxUploadSize" : 6291456, 
		"bucketRoot"	: "https://s3.amazonaws.com/",
		"acl"			: "public-read",
		// lifespan of upload policy
		//
		"expiresMinutes": 30, 
		"mappedFolders"	: {
			"image"		: "dropthings.in.images",
			"video"		: "dropthings.in.videos",
			"text"		: "dropthings.in.templates",
			"default"	: "dropthings.in"
		},
		"acceptedMimeTypes" : [
			"image/jpeg",
			"image/png",
			"image/gif",
			"text/html"
		]
	}
};