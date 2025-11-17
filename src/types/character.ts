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

