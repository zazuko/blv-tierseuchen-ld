const fetch = require('node-fetch')
const rdf = require('rdf-ext')

async function municipalityLookup (quad) {
  if (quad.predicate.value !== 'http://example.org/municipality') {
    return quad
  }

  const raw = await (await fetch(quad.object.value)).text()
  var result = {}

  try {
    result = JSON.parse(raw)
  } catch (err) {
    console.log(`Lookup for ${quad.subject.value} failed, got non JSON: ${raw}`)
    return rdf.quad(quad.subject, rdf.namedNode('http://ld.zazuko.com/animalpest/attribute/municipality'), rdf.namedNode('https://ld.geo.admin.ch/boundaries/country/CH'))
  }

  if ((result.status && result.status === 'error') || result.results.length === 0) {
    console.log(`Lookup for ${quad.subject.value} failed, got: ${JSON.stringify(result)} `)
    return rdf.quad(quad.subject, rdf.namedNode('http://ld.zazuko.com/animalpest/attribute/municipality'), rdf.namedNode('https://ld.geo.admin.ch/boundaries/country/CH'))
  } else {
    return rdf.quad(quad.subject, rdf.namedNode('http://ld.zazuko.com/animalpest/attribute/municipality'), rdf.namedNode(`http://classifications.data.admin.ch/municipality/${result.results[0].id}`))
  }
}

module.exports = municipalityLookup
