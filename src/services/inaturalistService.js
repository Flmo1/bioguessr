// This file talks to the iNaturalist API.
// It is free and needs no API key.
import { getDistance } from '@/utils/distance'

// Search for species by name. Returns a short list to choose from.
export async function searchSpecies(name) {
  const url = 'https://api.inaturalist.org/v1/taxa?rank=species&per_page=8&q=' + encodeURIComponent(name)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('iNaturalist search failed')
  }

  const data = await response.json()

  // Keep only the ones that have a photo, and only the fields we need
  const list = []
  for (const taxon of data.results) {
    if (taxon.default_photo) {

      // Some species already come with several photos
      let secondPhoto = ''
      if (taxon.taxon_photos && taxon.taxon_photos.length > 1) {
        secondPhoto = taxon.taxon_photos[1].photo.medium_url
      }

      list.push({
        id: taxon.id,
        commonName: taxon.preferred_common_name || taxon.name,
        scientificName: taxon.name,
        photoUrl: taxon.default_photo.medium_url,
        photoUrl2: secondPhoto,
        photoCredit: taxon.default_photo.attribution || 'Photo from iNaturalist',
        wikipedia: taxon.wikipedia_summary || '',
      })
    }
  }

  return list
}

// Get real sightings of a species.
// This gives us the location AND some extra photos.
export async function getLocation(taxonId) {
  const url = 'https://api.inaturalist.org/v1/observations' +
    '?taxon_id=' + taxonId +
    '&geo=true&photos=true&quality_grade=research&per_page=100'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('iNaturalist observations failed')
  }

  const data = await response.json()

  const points = []
  const photos = []

  for (const observation of data.results) {
    if (observation.geojson) {
      points.push({
        lng: observation.geojson.coordinates[0],
        lat: observation.geojson.coordinates[1],
      })
    }

    // Collect a few photos we can use as a backup
    if (observation.photos && observation.photos.length > 0 && photos.length < 5) {
      // The url we get is a tiny square, so swap it for a bigger one
      const bigger = observation.photos[0].url.replace('square', 'medium')
      photos.push(bigger)
    }
  }

  if (points.length === 0) {
    return null
  }

  // The middle of all the sightings
  let totalLat = 0
  let totalLng = 0
  for (const point of points) {
    totalLat = totalLat + point.lat
    totalLng = totalLng + point.lng
  }
  const centerLat = totalLat / points.length
  const centerLng = totalLng / points.length

  // How far the sightings spread out from the middle
  let biggest = 0
  for (const point of points) {
    const distance = getDistance(centerLat, centerLng, point.lat, point.lng)
    if (distance > biggest) {
      biggest = distance
    }
  }

  // Keep the circle sensible: at least 100 km, at most 3000 km
  let radius = Math.round(biggest)
  if (radius < 100) radius = 100
  if (radius > 3000) radius = 3000

  return {
    lat: Number(centerLat.toFixed(4)),
    lng: Number(centerLng.toFixed(4)),
    radius: radius,
    sightings: points.length,
    photos: photos,
  }
}