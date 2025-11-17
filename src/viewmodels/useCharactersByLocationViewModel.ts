import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocationAssignments } from '../providers/LocationAssignmentsProvider'
import type { AssignedCharacterSummary } from '../types/character'

type LocationEntry = [string, AssignedCharacterSummary[]]

interface CharactersByLocationViewModel {
  hasLocations: boolean
  locationEntries: LocationEntry[]
  selectedLocation: string
  activeResidents: AssignedCharacterSummary[]
  showSelectionPrompt: boolean
  showEmptyResidentsState: boolean
  handleSelectLocation: (locationName: string) => void
}

export const useCharactersByLocationViewModel =
  (): CharactersByLocationViewModel => {
    const { locations } = useLocationAssignments()
    const [selectedLocation, setSelectedLocation] = useState('')

    const locationEntries = useMemo<LocationEntry[]>(
      () => Object.entries(locations).sort(([a], [b]) => a.localeCompare(b)),
      [locations],
    )

    useEffect(() => {
      if (locationEntries.length === 0) {
        if (selectedLocation) {
          setSelectedLocation('')
        }
        return
      }

      const currentSelectionExists = locationEntries.some(
        ([locationName]) => locationName === selectedLocation,
      )

      if (!currentSelectionExists) {
        setSelectedLocation(locationEntries[0][0])
      }
    }, [locationEntries, selectedLocation])

    const handleSelectLocation = useCallback((locationName: string) => {
      setSelectedLocation(locationName)
    }, [])

    const activeResidents = selectedLocation
      ? locations[selectedLocation] ?? []
      : []

    const hasLocations = locationEntries.length > 0

    return {
      hasLocations,
      locationEntries,
      selectedLocation,
      activeResidents,
      showSelectionPrompt: !selectedLocation,
      showEmptyResidentsState: Boolean(selectedLocation) && activeResidents.length === 0,
      handleSelectLocation,
    }
  }

