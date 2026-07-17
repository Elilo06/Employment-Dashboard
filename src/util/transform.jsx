// Rows for one geography, sorted by date: for the line chart
export function seriesFor(rows, geo) {
  return rows
    .filter((r) => r.GEO === geo && r.VALUE != null)
    .map((r) => ({ date: r.REF_DATE, value: r.VALUE }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
}

const PROVINCES = [
  'Ontario', 'Quebec', 'British Columbia', 'Alberta',
  'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick',
  'Newfoundland and Labrador', 'Prince Edward Island',
]

// Latest value per province: for the bar and pie charts
export function latestByProvince(rows) {
  const latestDate = rows
    .filter((r) => r.GEO === 'Canada')
    .map((r) => r.REF_DATE)
    .sort()
    .at(-1)

  return PROVINCES.map((geo) => {
    const row = rows.find((r) => r.GEO === geo && r.REF_DATE === latestDate)
    return { geo, value: row ? row.VALUE : 0 }
  }).sort((a, b) => b.value - a.value)
}