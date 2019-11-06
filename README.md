# My Awesome Atlasboard Dashboard

This project contains an example of using atlasboard as a wallboard.

Jobs:

1. chef - get from chef databag expected applications (and versions)
2. glassfish - get from glassfish actual applications (and versions)
3. git - get from git outstanding pull requests
4. build - not started
5. jira - not started

Widgets:

1. chef - display a table of versions (by application and environment)
2. glassfish - display a tree of applications (by environment and server)
3. git - display list of outstanding pull requests with html links
4. build - not started
5. jira - not started

How To:

Install :

1. install jsenv from https://github.com/johnlayton/farmclose
2. install atlasboard "npm install atlasboard"
3. add some config (get from jlayton)
4. run atlasboard start 4444 && open http://localhost:444

Configure :

1. place an amended version of this config in ./packages/default/_your_wallboard_name.json

```
{
  "layout" : {
    "title"    : "FISG",
    "customJS" : ["jquery.peity.js", "tree.js"],
    "widgets"  : [
      { "row" : 1, "col" : 1, "width"  : 2, "height" : 2, "widget" : "pulls",     "job" : "pullsjob",     "config" : "git" },
      { "row" : 1, "col" : 3, "width"  : 3, "height" : 2, "widget" : "chef",      "job" : "chefjob",      "config" : "chef" },
      { "row" : 4, "col" : 1, "width"  : 6, "height" : 2, "widget" : "glassfish", "job" : "glassfishjob", "config" : "glassfish" }
    ]
  },
  "config" : {
    "git" : {
      "github" : {
        "version"    : "3.0.0",
        "debug"      : false,
        "protocol"   : "http",
        "host"       : "git.fire.dse.vic.gov.au",
        "port"       : 80,
        "pathPrefix" : "/api/v3",
        "timeout"    : 5000
      },
      "auth"   : {
        "type"  : "oauth",
        "token" : "_replace_with_your_token_"
      },
      "org"    : "fisg",
      "title"  : "Fisg Pull Requests"
    },
    "chef" : {
      "auth"    : {
        "user_name" : "buildbot",
        "key_path"  : "_path_to_/buildbot.pem",
        "url"       : "https://chef.fire.dse.vic.gov.au"
      },
      "title" : "Fisg Applications",
      "bag"   : "applications"
    },
    "glassfish" : {
      "auth"      : {
        "user_name" : "buildbot",
        "key_path"  : "_path_to_/buildbot.pem",
        "url"       : "https://chef.fire.dse.vic.gov.au"
      },
      "title"     : "Fisg Deployments"
    },
  }
}
```

# hobanavenue
