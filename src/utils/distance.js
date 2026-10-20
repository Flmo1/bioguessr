// Haversine formula: distance in km between two points on Earth.
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // radius of the Earth in km

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

function toRadians(degrees) {
  return degrees * Math.PI / 180
}

// 5000 points for a perfet guess, 0 points at 5000 km or furter.
export function getPoints(distance, radius) {
  const missedBy = distance - radius
  if (missedBy <= 0) return 5000
  const points = 5000 - missedBy
  if (points < 0) return 0
  return points
}