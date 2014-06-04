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
