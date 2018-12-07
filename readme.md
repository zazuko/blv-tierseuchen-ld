## blv-tierseuche pipelines

To download and process entire dataset simply run:

```bash
npm start
```

### Pipelines

There a few pipelines in the definition. All of the share these parameters which can be
overriden from command line

| parameter | default value | description |
| --- | --- | --- |
| sourceDir | source | location for extracted files |
| targetDir | target | directory to write resulting n-triples  documents |
| sourceUrl | http://ktk.netlabs.org/misc/rdf/seuchenmeldungen.zip ||

Here's an example command for running with altered values

```bash
npm start -- --variable targetDir=processed
```

Note that the `--` are necessary with NPM.

It is also possible to run the process partially. Do check below.

#### Download only

```
npm run pipeline -- urn:pipeline:tierseuchen-ld#Download-Sources
```

Parameters:
* `sourceUrl`
* `sourceDir`

#### Process previously downloaded files

```
npm run pipeline -- urn:pipeline:tierseuchen-ld#TransformFiles
```

Parameters:
* `sourceDir`
* `targetDir`

#### Process a single file

```
npm run pipeline -- urn:pipeline:tierseuchen-ld#TransformCsv --variable csv=Stammdaten_tierart.csv
```

Parameters:
* `csv` (mandatory)
* `sourceDir`
* `targetDir`

### CSVW mappings

Mapping files are currently unaltered output of [`csvw-metadata.js`][meta-tool] tool.

[meta-tool]: https://github.com/rdf-ext/rdf-parser-csvw/tree/develop/bin
