const fetch = require('node-fetch')
const rdf = require('rdf-ext')
const polly = require('polly-js')

const retryTimes = 5
const fallbackMunicipality = rdf.namedNode('https://ld.geo.admin.ch/boundaries/country/CH')

async function findMunicipality (quad, log) {
  const res = await fetch(quad.object.value)
  if (!res.ok) {
    throw new Error(`Response was ${res.status} ${res.statusText}`)
  }
  const raw = await res.text()

  const result = JSON.parse(raw)

  if (result.status && result.status === 'error') {
    throw new Error(`Got: ${JSON.stringify(result)} `)
  }
  if (result.results.length === 0) {
    log.warn(`No municipality found for ${quad.subject.value}`)
    return fallbackMunicipality
  }

  return rdf.namedNode(`http://classifications.data.admin.ch/municipality/${result.results[0].id}`)
}

module.exports = async function (quad) {
  if (quad.predicate.value !== 'http://example.org/municipality') {
    return quad
  }

  const municipality = await polly()
    .handle(err => {
      this.log.debug(`Retrying lookup for ${quad.subject.value}. ${err.message}`)
      return true
    })
    .waitAndRetry(retryTimes)
    .executeForPromise(() => findMunicipality(quad, this.log))
    .catch(() => {
      this.log.warn(`Lookup for ${quad.subject.value} failed after ${retryTimes}`)
      return fallbackMunicipality
    })

  return rdf.quad(quad.subject, rdf.namedNode('http://ld.zazuko.com/animalpest/attribute/municipality'), municipality)
}
