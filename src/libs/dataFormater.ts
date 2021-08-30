import { GameCompany, GameGenre, GamePlatform } from 'src/types/Game'
import { Keywords } from 'src/types/Keyword'
import { getCompanyByID } from './externalRequest'

export const formatGenres = (genres: GameGenre[]): GameGenre[] => {
  const newGenres = []

  genres.map((item) => {
    newGenres.push(item.name)
  })

  return newGenres
}

export const formatPlatforms = (platforms: GamePlatform[]): string[] => {
  const newPlatforms = []

  platforms.map((item) => {
    newPlatforms.push(item.abbreviation)
  })

  return newPlatforms
}

export const generateRandomFloatInRange = (min: number, max: number): number => {
  const generetedNumber = ((Math.random() * (max - min + 1)) + min)
  const formatedNumber = generetedNumber.toFixed(0)

  return Number(formatedNumber)
}

export const slugfy = (str: string): string => {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '') // collapse whitespace and replace by -
    .replace(/-+/g, '') // collapse dashes

  return str
}

const longTextToKeyword = (description: string): string[] => {
  const generatedKeywords = []
  const keywordMutations = []

  for (const keyword in Keywords) {
    const firstWord = keyword[0].toUpperCase() + keyword.slice(1, keyword.length) + ' '
    const lastWord = ' ' + keyword + '.'
    const commaWord = ' ' + keyword + ', '
    const regularWord = ' ' + keyword + ' '
    keywordMutations[firstWord] = Keywords[keyword]
    keywordMutations[lastWord] = Keywords[keyword]
    keywordMutations[commaWord] = Keywords[keyword]
    keywordMutations[regularWord] = Keywords[keyword]
  }

  for (const keyword in keywordMutations) {
    if (description.includes(keyword)) {
      const index = generatedKeywords.findIndex((item) => item.keyword === Keywords[keyword])
      if (keyword in keywordMutations) {
        generatedKeywords.push(`#${slugfy(keywordMutations[keyword])}`)
      } else if (index < 0) {
        generatedKeywords.push(`#${slugfy(keywordMutations[keyword])}`)
      } else {
        generatedKeywords.push(`#${slugfy(generatedKeywords[index])}`)
      }
    }
  }

  return generatedKeywords
}

export const generateKeywords = (
  genres?: GameGenre[],
  platforms?: GamePlatform[],
  summary?: string,
  storyline?: string,
  name?: string
): string[] => {
  const keywords = []

  if (summary) {
    keywords.push(...longTextToKeyword(summary))
  }

  if (storyline) {
    keywords.push(...longTextToKeyword(storyline))
  }

  if (name) {
    if (name.includes(':')) {
      const splitedName = name.split(':')
      keywords.push(`#${slugfy(splitedName[0])}`)
    }

    if (name.includes('-')) {
      const splitedName = name.split('-')
      keywords.push(`#${slugfy(splitedName[0])}`)
    }
  }

  if (genres) {
    genres.map((item) => {
      keywords.push(`#${slugfy(item.name)}`)
    })
  }

  if (platforms) {
    platforms.map((item) => {
      keywords.push(`#${slugfy(item.abbreviation)}`)
    })
  }

  const uniqKeywords = [...new Set(keywords)]

  return uniqKeywords
}

export const formatCompanies = async (companies: GameCompany[]): Promise<GameCompany[]> => {
  const formatedCompanies = []
  const companiesID = []

  companies.map(async (item) => {
    companiesID.push(item.company)
  })

  const companiesObj = await getCompanyByID(companiesID)

  companiesObj.map((item) => {
    formatedCompanies.push({
      id: item.id,
      name: item.name
    })
  })

  return formatedCompanies
}
