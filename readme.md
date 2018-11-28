## blv-tierseuche pipelines

To process inout file simply run:

```bash
npm start
```

To fetch the zip archive from an alternative location add a source param

```bash
npm start -- --variable source=http://ktk.netlabs.org/misc/rdf/seuchenmeldungen.zip
```

Note that the `--` are necessary with NPM

### CSVW mappings

Mapping files are currently unaltered output of [`csvw-metadata.js`][meta-tool] tool.

[meta-tool]: https://github.com/rdf-ext/rdf-parser-csvw/tree/develop/bin
