import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'

interface CharacterCardProps {
  id: string
  name: string
  status: string
  species?: string
  locationName?: string
  image: string
  to?: string
  footer?: ReactNode
}

export const CharacterCard = ({
  id,
  name,
  status,
  species,
  locationName,
  image,
  to,
  footer,
}: CharacterCardProps) => {
  const content = (
    <article className="character-card" aria-labelledby={`character-${id}`}>
      <div className="character-card__media">
        <img src={image} alt={name} loading="lazy" />
      </div>

      <div className="character-card__body">
        <div className="character-card__title-row">
          <h3 id={`character-${id}`}>{name}</h3>
          <StatusBadge status={status} />
        </div>
        {species && <p className="character-card__meta">{species}</p>}
        {locationName && (
          <p className="character-card__location">
            Last known location: <strong>{locationName}</strong>
          </p>
        )}
        {footer}
      </div>
    </article>
  )

  if (to) {
    return (
      <Link className="character-card__link" to={to}>
        {content}
      </Link>
    )
  }

  return content
}

