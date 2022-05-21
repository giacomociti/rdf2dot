A simple RDF visualization tool based on [GraphViz](https://www.graphviz.org/).

The following RDF triples in turtle format:

```ttl
PREFIX : <http://ex.org/>

:P1 a :Person ;
    :age 42 ;
    :parent :P2 .
```

are converted to a dot file that renders as the following SVG:


![](test.ttl.dot.svg)

To make compact visualizations, literal properties and type definitions are collapsed with their subject.


This project (a quick hack with no pretenses) started as a .NET console application, written in F#. Thanks to [Fable](https://fable.io/), the same code now runs also in the browser and it's available online [here](https://giacomociti.github.io/rdf2dot/).