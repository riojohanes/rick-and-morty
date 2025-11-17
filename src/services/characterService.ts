import { useQuery } from '@apollo/client/react'
import { GET_CHARACTERS, GET_CHARACTER } from '../api/queries'
import type { Character, CharacterDetail } from '../types/character'

interface CharactersListInfo {
  pages: number
  next: number | null
  prev: number | null
}

export interface CharactersListResponse {
  characters: {
    info: CharactersListInfo
    results: Character[]
  }
}

export interface CharactersListVariables {
  page: number
  name?: string
}

export const useCharactersListQuery = ({
  page,
  name,
}: CharactersListVariables) => {
  return useQuery<CharactersListResponse>(GET_CHARACTERS, {
    variables: {
      page,
      filter: name
        ? {
            name,
          }
        : undefined,
    },
    fetchPolicy: 'cache-and-network',
  })
}

export interface CharacterDetailResponse {
  character: CharacterDetail
}

export const useCharacterDetailQuery = (id?: string) =>
  useQuery<CharacterDetailResponse>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  })

