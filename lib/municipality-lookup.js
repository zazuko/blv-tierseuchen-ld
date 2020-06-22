const fetch = require('node-fetch')
const rdf = require('rdf-ext')

async function municipalityLookup (quad) {
  if (quad.predicate.value !== 'http://example.org/municipality') {
    return quad
  }

  const logFailure = (reason) => {
    this.log.warn(`Lookup for ${quad.subject.value} failed. ${reason}`)
  }

  let municipality = rdf.namedNode('https://ld.geo.admin.ch/boundaries/country/CH')
  let raw
  try {
    const res = await fetch(quad.object.value)
    if (res.ok) {
      raw = await res.text()
    } else {
      logFailure(`Response was ${res.status} ${res.statusText}`)
    }
  } catch (e) {
    logFailure(e.message)
  }

  let result = { results: [] }

  if (raw) {
    try {
      result = JSON.parse(raw)
    } catch (err) {
      logFailure(`Got non JSON: ${raw}`)
    }

    if ((result.status && result.status === 'error') || result.results.length === 0) {
      logFailure(`Got: ${JSON.stringify(result)} `)
    } else {
      municipality = rdf.namedNode(`http://classifications.data.admin.ch/municipality/${result.results[0].id}`)
    }
  }

  return rdf.quad(quad.subject, rdf.namedNode('http://ld.zazuko.com/animalpest/attribute/municipality'), municipality)
}

module.exports = municipalityLookup
