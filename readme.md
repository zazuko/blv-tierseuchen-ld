## blv-tierseuche pipelines

To process mapping run of the NPM scripts:

* start:grund
* start:seuchenspez_typ
* start:seuchenspezifikation
* start:tierart
* start:tierkategorie
* start:tierseuchen

### Pipeline

The pipeline processes a single file from the archive. It gets downloaded
every time which should be optimized. The file to extract and process is
provided a input parameter to the pipeline and expects a matching mapping
file to be present in the `metadata` folder.

### CSVW mappings

Mapping files are currently unaltered output of [`csvw-metadata.js`][meta-tool] tool.

[meta-tool]: https://github.com/rdf-ext/rdf-parser-csvw/tree/develop/bin
