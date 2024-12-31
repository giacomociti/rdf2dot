[![NPM Version](https://img.shields.io/npm/v/rdf2dot-wc.svg?style=flat)](https://npm.im/rdf2dot-wc)

Web Components to visualize RDF, using `eyereasoner` and `viz.js`.

Components `rdf2dot-basic` and `rdf2dot-default` require a `data` attribute with RDF serialized as text/turtle.

```html
<html>
  <body>
    <h1>RDF visualization</h1>
    <rdf2dot-default data="
        @prefix dcterms: <http://purl.org/dc/terms/> .
        @prefix wd: <http://www.wikidata.org/entity/> .
        @prefix dbo: <https://dbpedia.org/ontology/> .
        @prefix dbpedia: <http://dbpedia.org/resource/> .
        
        wd:Q12418
            dcterms:title 'Mona Lisa' ;
            dcterms:creator dbpedia:Leonardo_da_Vinci .

        wd:Q128910
            dcterms:title 'The Last Supper' ;
            dcterms:creator dbpedia:Leonardo_da_Vinci .

        dbpedia:Leonardo_da_Vinci
            dbo:birthName 'Leonardo da Vinci' ;
            dbo:birthPlace dbpedia:Republic_of_Florence .
    ">
    </rdf2dot-default>
    <script src="https://eyereasoner.github.io/eye-js/16/latest/index.js"></script>
    <script src="https://unpkg.com/@viz-js/viz@3.1.0/lib/viz-standalone.js"></script> 
    <script src="https://unpkg.com/rdf2dot-wc/rdf2dot-wc.js"></script> 
  </body>
</html>
```
Component `rdf2dot-custom` requires an additional `rules` attribute with Notation-3 rules.