export interface CharacterLocation {
  name: string
}

export interface Character {
  id: string
  name: string
  status: string
  species: string
  gender: string
  image: string
  origin: CharacterLocation
  location: CharacterLocation
}

export interface AssignedCharacterSummary {
  id: string
  name: string
  image: string
  status: string
  species: string
}

export interface CharacterEpisode {
  id: string
  name: string
  episode: string
}

export interface CharacterDetail extends Character {
  type?: string
  origin: Character['origin'] & { dimension?: string }
  location: Character['location'] & { dimension?: string; type?: string }
  episode: CharacterEpisode[]
}

