import { useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { useCharacterDetailViewModel } from '../viewmodels/useCharacterDetailViewModel'

export const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const {
    loading,
    error,
    character,
    highlightedEpisodes,
    availableLocations,
    currentAssignment,
    selectedLocation,
    newLocationName,
    feedbackMessage,
    canAssignExisting,
    handleAssignExisting,
    handleCreateLocation,
    handleNewLocationNameChange,
    handleSelectLocation,
    handleUnassign,
  } = useCharacterDetailViewModel(id)

  if (loading) {
    return (
      <section className="page">
        <p role="status" className="page__helper">
          Memuat detail karakter...
        </p>
      </section>
    )
  }

  if (error || !character) {
    return (
      <section className="page">
        <EmptyState
          title="Detail karakter tidak tersedia."
          description="Periksa koneksi atau coba lainnya."
        />
      </section>
    )
  }

  return (
    <section className="page">
      <header className="page__header">
        <div className="detail-hero">
          <img src={character.image} alt={character.name} />
          <div>
            <p className="eyebrow">Character Detail</p>
            <h1>{character.name}</h1>
            <div className="detail-hero__badges">
              <StatusBadge status={character.status} />
              <span className="detail-hero__chip">{character.species}</span>
              <span className="detail-hero__chip">{character.gender}</span>
            </div>
            <ul className="detail-hero__meta">
              <li>
                <span>Origin : </span>
                <strong>{character.origin?.name ?? 'Unknown'}</strong>
              </li>
              <li>
                <span>Last location : </span>
                <strong>{character.location?.name ?? 'Unknown'}</strong>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <section className="card assign-card">
        <div>
          <p className="eyebrow">Location Assignment</p>
          <h2>Atur lokasi khusus</h2>
          <p className="page__description">
            Tetapkan karakter ke lokasi buatanmu sendiri. Data akan tersimpan di
            perangkat ini.
          </p>
          {currentAssignment && (
            <p className="assign-card__current">
              Saat ini berada di: <strong>{currentAssignment}</strong>
            </p>
          )}
        </div>

        {feedbackMessage && (
          <p role="status" className="assign-card__feedback">
            {feedbackMessage}
          </p>
        )}

        <div className="assign-card__actions">
          <div className="assign-card__panel">
            <label className="field">
              <span className="field__label">Gunakan lokasi yang ada</span>
              <select
                value={selectedLocation}
                onChange={(event) => handleSelectLocation(event.target.value)}
              >
                <option value="">Pilih lokasi</option>
                {availableLocations.map((locationName) => (
                  <option key={locationName} value={locationName}>
                    {locationName}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleAssignExisting}
              disabled={!canAssignExisting}
            >
              Assign ke lokasi ini
            </button>
          </div>

          <form className="assign-card__panel" onSubmit={handleCreateLocation}>
            <label className="field">
              <span className="field__label">Buat lokasi baru</span>
              <input
                type="text"
                placeholder="Contoh: Citadel Block C"
                value={newLocationName}
                onChange={(event) =>
                  handleNewLocationNameChange(event.target.value)
                }
                required
              />
            </label>
            <button type="submit">Buat & Assign</button>
          </form>

          {currentAssignment && (
            <button
              type="button"
              className="button--ghost"
              onClick={handleUnassign}
            >
              Lepas dari lokasi
            </button>
          )}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">Episode Highlights</p>
        <h2>Tampil pada</h2>
        <ul className="episode-list">
          {highlightedEpisodes.map((episode) => (
            <li key={episode.id}>
              <strong>{episode.episode}</strong>
              <span>{episode.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

