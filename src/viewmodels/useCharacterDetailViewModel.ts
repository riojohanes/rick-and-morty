import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocationAssignments } from '../providers/LocationAssignmentsProvider'
import { useCharacterDetailQuery } from '../services/characterService'
import type { CharacterDetail, CharacterEpisode } from '../types/character'

interface CharacterDetailViewModel {
  loading: boolean
  error: boolean
  character?: CharacterDetail
  highlightedEpisodes: CharacterEpisode[]
  availableLocations: string[]
  selectedLocation: string
  newLocationName: string
  feedbackMessage: string | null
  currentAssignment?: string
  canAssignExisting: boolean
  handleSelectLocation: (locationName: string) => void
  handleAssignExisting: () => void
  handleNewLocationNameChange: (value: string) => void
  handleCreateLocation: (event: FormEvent<HTMLFormElement>) => void
  handleUnassign: () => void
}

export const useCharacterDetailViewModel = (
  characterId?: string,
): CharacterDetailViewModel => {
  const { locations, characterLocations, assignCharacter, unassignCharacter } =
    useLocationAssignments()

  const [selectedLocation, setSelectedLocation] = useState('')
  const [newLocationName, setNewLocationName] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const { data, loading, error } = useCharacterDetailQuery(characterId)

  const character = data?.character
  const currentAssignment = characterId ? characterLocations[characterId] : undefined
  const availableLocations = useMemo(
    () => Object.keys(locations),
    [locations],
  )

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

  const highlightedEpisodes: CharacterEpisode[] = useMemo(() => {
    if (!character) {
      return []
    }

    return character.episode.slice(0, 6)
  }, [character])

  useEffect(() => {
    if (availableLocations.length === 0) {
      if (selectedLocation) {
        setSelectedLocation('')
      }
      return
    }

    const currentExists = availableLocations.includes(selectedLocation)

    if (!currentExists) {
      setSelectedLocation(availableLocations[0])
    }
  }, [availableLocations, selectedLocation])

  const handleSelectLocation = useCallback((locationName: string) => {
    setSelectedLocation(locationName)
  }, [])

  const handleAssignExisting = useCallback(() => {
    if (!characterSummary || !selectedLocation) {
      setFeedbackMessage('Pilih lokasi yang tersedia terlebih dahulu.')
      return
    }

    assignCharacter(characterSummary, selectedLocation)
    setFeedbackMessage(`Berhasil assign ke ${selectedLocation}.`)
  }, [assignCharacter, characterSummary, selectedLocation])

  const handleNewLocationNameChange = useCallback((value: string) => {
    setNewLocationName(value)
  }, [])

  const handleCreateLocation = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!characterSummary) {
        return
      }

      const result = assignCharacter(characterSummary, newLocationName, {
        requireNewLocation: true,
      })

      if (!result.ok) {
        setFeedbackMessage(result.error ?? 'Gagal membuat lokasi baru.')
      } else {
        const trimmedName = newLocationName.trim()
        setFeedbackMessage(`Lokasi ${trimmedName} berhasil dibuat.`)
        setSelectedLocation(trimmedName)
        setNewLocationName('')
      }
    },
    [assignCharacter, characterSummary, newLocationName],
  )

  const handleUnassign = useCallback(() => {
    if (!characterId) return
    unassignCharacter(characterId)
    setFeedbackMessage('Karakter dilepas dari lokasi.')
  }, [characterId, unassignCharacter])

  const canAssignExisting = Boolean(selectedLocation)

  return {
    loading,
    error: Boolean(error),
    character,
    highlightedEpisodes,
    availableLocations,
    selectedLocation,
    newLocationName,
    feedbackMessage,
    currentAssignment,
    canAssignExisting,
    handleSelectLocation,
    handleAssignExisting,
    handleNewLocationNameChange,
    handleCreateLocation,
    handleUnassign,
  }
}

