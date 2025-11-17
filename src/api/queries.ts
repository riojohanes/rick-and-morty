import { gql } from '@apollo/client'

export const GET_CHARACTERS = gql`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
        origin {
          name
        }
        location {
          name
        }
      }
    }
  }
`

export const GET_CHARACTER = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      type
      image
      origin {
        name
        dimension
      }
      location {
        name
        dimension
        type
      }
      episode {
        id
        name
        episode
      }
    }
  }
`

