import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_CHARACTERS } from '../api/queries'
import { CharacterCard } from '../components/CharacterCard'
import { EmptyState } from '../components/EmptyState'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { Character } from '../types/character'

interface CharactersResponse {
  characters: {
    info: {
      pages: number
      next: number | null
      prev: number | null
    }
    results: Character[]
  }
}

export const CharactersListPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  const { data, loading, error } = useQuery<CharactersResponse>(GET_CHARACTERS, {
    variables: {
      page,
      filter: debouncedSearch
        ? {
            name: debouncedSearch,
          }
        : undefined,
    },
    fetchPolicy: 'cache-and-network',
  })

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearch(event.target.value)
  }

  const characters: Character[] = data?.characters?.results ?? []

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>Characters List</h1>
          <p className="page__description">
            Temukan karakter favoritmu dan lihat detail lengkapnya.
          </p>
        </div>

        <label className="field">
          <span className="field__label">Cari karakter</span>
          <input
            type="search"
            placeholder="Cari berdasarkan nama..."
            value={search}
            onChange={handleSearchChange}
          />
        </label>
      </header>

      {error && (
        <EmptyState
          title="Gagal memuat karakter."
          description="Silakan coba ulang beberapa saat lagi."
        />
      )}

      <div className="character-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            id={character.id}
            name={character.name}
            status={character.status}
            species={character.species}
            locationName={character.location?.name}
            image={character.image}
            to={`/characters/${character.id}`}
          />
        ))}
      </div>

      {loading && (
        <p role="status" className="page__helper">
          Memuat karakter...
        </p>
      )}

      {!loading && characters.length === 0 && !error && (
        <EmptyState
          title="Karakter tidak ditemukan."
          description="Coba kata kunci lainnya."
        />
      )}

      <footer className="pagination">
        <button
          type="button"
          disabled={!data?.characters?.info?.prev || loading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        >
          Sebelumnya
        </button>
        <p>
          Halaman {page}
          {data?.characters?.info?.pages
            ? ` dari ${data.characters.info.pages}`
            : ''}
        </p>
        <button
          type="button"
          disabled={!data?.characters?.info?.next || loading}
          onClick={() => setPage((current) => current + 1)}
        >
          Berikutnya
        </button>
      </footer>
    </section>
  )
}

