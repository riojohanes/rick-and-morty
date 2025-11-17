import { CharacterCard } from '../components/CharacterCard'
import { EmptyState } from '../components/EmptyState'
import { useCharactersByLocationViewModel } from '../viewmodels/useCharactersByLocationViewModel'

export const CharactersByLocationPage = () => {
  const {
    hasLocations,
    locationEntries,
    selectedLocation,
    activeResidents,
    showSelectionPrompt,
    showEmptyResidentsState,
    handleSelectLocation,
  } = useCharactersByLocationViewModel()

  if (!hasLocations) {
    return (
      <section className="page">
        <EmptyState
          title="Belum ada lokasi tersimpan."
          description="Assign karakter ke lokasi melalui halaman detail untuk melihat data di sini."
        />
      </section>
    )
  }
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
              onClick={() => handleSelectLocation(locationName)}
            >
              <strong>{locationName}</strong>
              <span>{residents.length} karakter</span>
            </button>
          ))}
        </aside>

        <div className="locations-content">
          {showSelectionPrompt && (
            <EmptyState title="Pilih lokasi" description="Mulai dengan memilih lokasi di sisi kiri." />
          )}

          {showEmptyResidentsState && (
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

