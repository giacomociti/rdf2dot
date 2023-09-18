curl --data-urlencode "query@versions.sparql" https://lindas.admin.ch/query > versions.ttl
node ../../bin/rdf2dot.js version.n3 versions.ttl > versions.dot