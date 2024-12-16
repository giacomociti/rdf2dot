[![NPM Version](https://img.shields.io/npm/v/rdf2dot-wc.svg?style=flat)](https://npm.im/rdf2dot-wc)

Web Components to visualize RDF.
Depends on `eyereasoner` and `viz.js`.

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
            dcterms:title "Mona Lisa" ;
            dcterms:creator dbpedia:Leonardo_da_Vinci .

        wd:Q128910
            dcterms:title "The Last Supper" ;
            dcterms:creator dbpedia:Leonardo_da_Vinci .

        dbpedia:Leonardo_da_Vinci
            dbo:birthName "Leonardo da Vinci" ;
            dbo:birthPlace dbpedia:Republic_of_Florence .
    ">
    </rdf2dot-default>
    <script src="https://eyereasoner.github.io/eye-js/16/latest/index.js"></script>
    <script src="https://unpkg.com/@viz-js/viz@3.1.0/lib/viz-standalone.js"></script> 
    <script src="https://unpkg.com/rdf2dot-wc@0.2.1/rdf2dot-wc.js"></script> 
  </body>
</html>
```
