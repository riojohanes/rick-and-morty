import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import type { AssignedCharacterSummary } from '../types/character'

type LocationsMap = Record<string, AssignedCharacterSummary[]>
type CharacterLocationMap = Record<string, string>

interface LocationAssignmentsState {
  locations: LocationsMap
  characterLocations: CharacterLocationMap
}

interface AssignOptions {
  requireNewLocation?: boolean
}

interface AssignmentResult {
  ok: boolean
  error?: string
}

interface LocationAssignmentsContextValue
  extends LocationAssignmentsState {
  assignCharacter: (
    character: AssignedCharacterSummary,
    locationName: string,
    options?: AssignOptions,
  ) => AssignmentResult
  unassignCharacter: (characterId: string) => void
}

const defaultState: LocationAssignmentsState = {
  locations: {},
  characterLocations: {},
}

const STORAGE_KEY = 'rm-location-assignments'

const LocationAssignmentsContext =
  createContext<LocationAssignmentsContextValue | null>(null)

export const LocationAssignmentsProvider = ({
  children,
}: PropsWithChildren) => {
  const [state, setState] = useLocalStorageState<LocationAssignmentsState>(
    STORAGE_KEY,
    defaultState,
  )

  const assignCharacter = useCallback<
    LocationAssignmentsContextValue['assignCharacter']
  >(
    (character, rawLocationName, options) => {
      const locationName = rawLocationName.trim()
      if (!locationName) {
        return { ok: false, error: 'Nama lokasi tidak boleh kosong.' }
      }

      if (options?.requireNewLocation && state.locations[locationName]) {
        return { ok: false, error: 'Nama lokasi harus unik.' }
      }

      setState((prev) => {
        const nextLocations: LocationsMap = { ...prev.locations }
        const nextCharacterLocations: CharacterLocationMap = {
          ...prev.characterLocations,
        }

        const previousLocation = nextCharacterLocations[character.id]

        if (previousLocation && previousLocation !== locationName) {
          const updatedCharacters =
            nextLocations[previousLocation]?.filter(
              (resident) => resident.id !== character.id,
            ) ?? []

          if (updatedCharacters.length === 0) {
            delete nextLocations[previousLocation]
          } else {
            nextLocations[previousLocation] = updatedCharacters
          }
        }

        const currentResidents = nextLocations[locationName] ?? []
        const existingIndex = currentResidents.findIndex(
          (resident) => resident.id === character.id,
        )

        let updatedResidents: AssignedCharacterSummary[]

        if (existingIndex >= 0) {
          updatedResidents = [...currentResidents]
          updatedResidents[existingIndex] = character
        } else {
          updatedResidents = [...currentResidents, character]
        }

        nextLocations[locationName] = updatedResidents
        nextCharacterLocations[character.id] = locationName

        return {
          locations: nextLocations,
          characterLocations: nextCharacterLocations,
        }
      })

      return { ok: true }
    },
    [setState, state.locations],
  )

  const unassignCharacter = useCallback<
    LocationAssignmentsContextValue['unassignCharacter']
  >(
    (characterId) => {
      setState((prev) => {
        const previousLocation = prev.characterLocations[characterId]

        if (!previousLocation) {
          return prev
        }

        const nextLocations: LocationsMap = { ...prev.locations }
        const filteredCharacters =
          nextLocations[previousLocation]?.filter(
            (resident) => resident.id !== characterId,
          ) ?? []

        if (filteredCharacters.length === 0) {
          delete nextLocations[previousLocation]
        } else {
          nextLocations[previousLocation] = filteredCharacters
        }

        const { [characterId]: _removed, ...nextCharacterLocations } =
          prev.characterLocations

        return {
          locations: nextLocations,
          characterLocations: nextCharacterLocations,
        }
      })
    },
    [setState],
  )

  const value = useMemo<LocationAssignmentsContextValue>(
    () => ({
      locations: state.locations,
      characterLocations: state.characterLocations,
      assignCharacter,
      unassignCharacter,
    }),
    [assignCharacter, state.characterLocations, state.locations, unassignCharacter],
  )

  return (
    <LocationAssignmentsContext.Provider value={value}>
      {children}
    </LocationAssignmentsContext.Provider>
  )
}

export const useLocationAssignments = () => {
  const context = useContext(LocationAssignmentsContext)
  if (!context) {
    throw new Error(
      'useLocationAssignments must be used within LocationAssignmentsProvider',
    )
  }

  return context
}

