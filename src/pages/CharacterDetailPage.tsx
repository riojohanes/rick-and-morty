import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_CHARACTER } from '../api/queries'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import type { Character } from '../types/character'
import { useLocationAssignments } from '../providers/LocationAssignmentsProvider'

type CharacterDetail = Character & {
  type?: string
  origin: Character['origin'] & { dimension?: string }
  location: Character['location'] & { type?: string; dimension?: string }
  episode: { id: string; name: string; episode: string }[]
}

type CharacterEpisode = CharacterDetail['episode'][number]

interface CharacterResponse {
  character: CharacterDetail
}

export const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { locations, characterLocations, assignCharacter, unassignCharacter } =
    useLocationAssignments()

  const [selectedLocation, setSelectedLocation] = useState('')
  const [newLocationName, setNewLocationName] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const { data, loading, error } = useQuery<CharacterResponse>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  })

  const character = data?.character
  const currentAssignment = id ? characterLocations[id] : undefined
  const availableLocations = Object.keys(locations)

  const characterSummary = useMemo(() => {
    if (!character) return null
    return {
      id: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      image: character.image,
    }
  }, [character])

  const handleAssignExisting = () => {
    if (!characterSummary || !selectedLocation) {
      setFeedbackMessage('Pilih lokasi yang tersedia terlebih dahulu.')
      return
    }
    assignCharacter(characterSummary, selectedLocation)
    setFeedbackMessage(`Berhasil assign ke ${selectedLocation}.`)
  }

  const handleCreateLocation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!characterSummary) return

    const result = assignCharacter(characterSummary, newLocationName, {
      requireNewLocation: true,
    })

    if (!result.ok) {
      setFeedbackMessage(result.error ?? 'Gagal membuat lokasi baru.')
    } else {
      setFeedbackMessage(`Lokasi ${newLocationName.trim()} berhasil dibuat.`)
      setNewLocationName('')
    }
  }

  const handleUnassign = () => {
    if (!id) return
    unassignCharacter(id)
    setFeedbackMessage('Karakter dilepas dari lokasi.')
  }

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

  const highlightedEpisodes: CharacterEpisode[] =
    character.episode.slice(0, 6)

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
                <span>Origin</span>
                <strong>{character.origin?.name ?? 'Unknown'}</strong>
              </li>
              <li>
                <span>Last location</span>
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
                onChange={(event) => setSelectedLocation(event.target.value)}
              >
                <option value="">Pilih lokasi</option>
                {availableLocations.map((locationName) => (
                  <option key={locationName} value={locationName}>
                    {locationName}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={handleAssignExisting} disabled={!selectedLocation}>
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
                onChange={(event) => setNewLocationName(event.target.value)}
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

