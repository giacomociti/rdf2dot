This is a .NET console application, written in F#, to convert RDF to the dot format of GraphViz.

The following RDF triples in turtle format:

```ttl
    base <http://ex.org/>
    prefix : <http://ex.org/property/>

    <person/P1> a <class/Person> ;
        :age 42 ;
        :parent <person/P2> .
```

are converted to a dot file that renders as the following SVG:


![](test.ttl.dot.svg)

To make compact visualizations, literal properties and type definitions are collpsed with their subject.

Base URI and namespace prefixes, passed as input options or stored in a configuration file, help shorten resource names:

```bash
dotnet run rdf2dot "test.ttl" -base http://ex.org/ -ns :http://ex.org/property/ -ns class:http://ex.org/class/
```