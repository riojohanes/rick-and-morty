import { useEffect, useMemo, useState } from 'react'
import { CharacterCard } from '../components/CharacterCard'
import { EmptyState } from '../components/EmptyState'
import { useLocationAssignments } from '../providers/LocationAssignmentsProvider'

export const CharactersByLocationPage = () => {
  const { locations } = useLocationAssignments()
  const [selectedLocation, setSelectedLocation] = useState('')

  const locationEntries = useMemo(
    () => Object.entries(locations).sort(([a], [b]) => a.localeCompare(b)),
    [locations],
  )

  useEffect(() => {
    if (!selectedLocation && locationEntries.length > 0) {
      setSelectedLocation(locationEntries[0][0])
    }
  }, [locationEntries, selectedLocation])

  if (locationEntries.length === 0) {
    return (
      <section className="page">
        <EmptyState
          title="Belum ada lokasi tersimpan."
          description="Assign karakter ke lokasi melalui halaman detail untuk melihat data di sini."
        />
      </section>
    )
  }

  const activeResidents = selectedLocation
    ? locations[selectedLocation] ?? []
    : []

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Custom Locations</p>
          <h1>Characters by Location</h1>
          <p className="page__description">
            Pilih lokasi untuk melihat karakter yang sudah kamu assign. Semua
            data tersimpan secara lokal.
          </p>
        </div>
      </header>

      <div className="locations-layout">
        <aside className="locations-list">
          {locationEntries.map(([locationName, residents]) => (
            <button
              key={locationName}
              type="button"
              className={
                locationName === selectedLocation
                  ? 'location-chip location-chip--active'
                  : 'location-chip'
              }
              onClick={() => setSelectedLocation(locationName)}
            >
              <strong>{locationName}</strong>
              <span>{residents.length} karakter</span>
            </button>
          ))}
        </aside>

        <div className="locations-content">
          {!selectedLocation && (
            <EmptyState title="Pilih lokasi" description="Mulai dengan memilih lokasi di sisi kiri." />
          )}

          {selectedLocation && activeResidents.length === 0 && (
            <EmptyState
              title="Belum ada karakter"
              description="Assign karakter baru melalui halaman detail."
            />
          )}

          <div className="character-grid">
            {activeResidents.map((character) => (
              <CharacterCard
                key={character.id}
                id={character.id}
                name={character.name}
                status={character.status}
                species={character.species}
                image={character.image}
                locationName={selectedLocation}
                to={`/characters/${character.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

