import axios from 'axios'
import { GameBase, GameCompany } from 'src/types/Game'
import { Header } from 'src/types/Header'

/**
 * Generates a header
 * @returns
 */
export const generateHead = async (requestToken: string): Promise<Header> => {
  return {
    'Client-ID': process.env.IGDBCLientKey,
    Authorization: `Bearer ${requestToken}`,
    'Content-Type': 'text/plain'
  }
}

/**
 * Generates an access token string from Twitch
 * @returns access_token
 */
export const doTwitchLogin = async (): Promise<string> => {
  const URL = `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDBCLientKey}&client_secret=${process.env.IGDBCLientSecret}&grant_type=client_credentials`

  const response = await axios.post(URL)
  return response.data.access_token
}

/**
 * Gets a game base by ID
 * @param id the game ID
 * @returns
 */
export const getGameByID = async (gameId: number): Promise<GameBase> => {
  try {
    const URL = 'https://api.igdb.com/v4/games'

    const requestToken = await doTwitchLogin()

    const body = `fields name, slug, id, summary, storyline, first_release_date,
  cover.*, screenshots.*, platforms.abbreviation, genres.name, involved_companies.*; where id = ${gameId};`

    const response = await axios.post(URL, body, {
      headers: await generateHead(requestToken)
    })

    if (response.data.length === 0) {
      throw new Error("there's no data")
    }

    return response.data[0]
  } catch (error) {
    return error
  }
}

export const getCompanyByID = async (companiesID: number[]): Promise<GameCompany[]> => {
  try {
    const URL = 'https://api.igdb.com/v4/companies'

    const requestToken = await doTwitchLogin()

    const body = `fields country,created_at,description,developed,logo,name,parent; where id = (${companiesID.join()});`

    const response = await axios.post(URL, body, {
      headers: await generateHead(requestToken)
    })

    return response.data
  } catch (error) {
    console.log(error)
  }
}
