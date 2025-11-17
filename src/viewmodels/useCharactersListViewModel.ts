import type { ErrorLike } from '@apollo/client'
import type { ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Character } from '../types/character'
import { useCharactersListQuery } from '../services/characterService'

interface PaginationState {
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface CharactersListViewModel {
  search: string
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  characters: Character[]
  loading: boolean
  error: ErrorLike | undefined
  pagination: PaginationState
  goToPreviousPage: () => void
  goToNextPage: () => void
  isEmpty: boolean
}

export const useCharactersListViewModel = (): CharactersListViewModel => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 400)

  const { data, loading, error } = useCharactersListQuery({
    page,
    name: debouncedSearch || undefined,
  })

  const characters: Character[] = data?.characters?.results ?? []

  const pagination = useMemo<PaginationState>(() => {
    const info = data?.characters?.info
    return {
      page,
      totalPages: info?.pages ?? 0,
      hasNext: Boolean(info?.next),
      hasPrev: Boolean(info?.prev),
    }
  }, [data?.characters?.info, page])

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPage(1)
      setSearch(event.target.value)
    },
    [],
  )

  const goToPreviousPage = useCallback(() => {
    if (pagination.hasPrev) {
      setPage((current) => Math.max(1, current - 1))
    }
  }, [pagination.hasPrev])

  const goToNextPage = useCallback(() => {
    if (pagination.hasNext) {
      setPage((current) => current + 1)
    }
  }, [pagination.hasNext])

  const isEmpty = !loading && characters.length === 0

  return {
    search,
    handleSearchChange,
    characters,
    loading,
    error,
    pagination,
    goToPreviousPage,
    goToNextPage,
    isEmpty,
  }
}

