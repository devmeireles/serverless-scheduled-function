import { Game, GameBase } from '../../types/Game'
import { getGameByID } from '../../libs/externalRequest'
import { formatCover, formatScreenshots } from 'src/libs/image'
import { formatCompanies, generateKeywords, generateRandomFloatInRange } from 'src/libs/dataFormater'
import dynamodb from 'src/libs/dynamodb'

const TableName = process.env.GAME_TABLE

/**
 *
 * @returns
 */
export const generateRandomGame = async (): Promise<Game> => {
  try {
    const itemID = generateRandomFloatInRange(10, 33000)

    const gameData: GameBase = await getGameByID(itemID)

    if (gameData.cover && (gameData.summary || gameData.storyline) && gameData.screenshots) {
      const game: Game = {
        id: gameData.id,
        name: gameData.name,
        slug: gameData.slug,
        summary: gameData.summary,
        storyline: gameData.storyline,
        firstReleaseDate: gameData.first_release_date,
        cover: formatCover(gameData.cover.url),
        screenshots: (gameData.screenshots) ? formatScreenshots(gameData.screenshots) : [],
        genres: gameData.genres || [],
        platforms: gameData.platforms || [],
        companies: (gameData.involved_companies) ? await formatCompanies(gameData.involved_companies) : []
      }

      game.keywords = generateKeywords(game.genres, game.platforms, game.summary, game.storyline, game.name)

      await dynamodb.put({ TableName, Item: game })

      return game
    } else {
      throw new Error(`${itemID} error on loading`)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 *
 * @returns
 */
export const generateGameByID = async (id: number): Promise<Game> => {
  try {
    const gameData: GameBase = await getGameByID(id)

    if (gameData.cover && (gameData.summary || gameData.storyline)) {
      const game: Game = {
        id: gameData.id,
        name: gameData.name,
        slug: gameData.slug,
        summary: gameData.summary,
        storyline: gameData.storyline,
        firstReleaseDate: gameData.first_release_date,
        cover: formatCover(gameData.cover.url),
        screenshots: (gameData.screenshots) ? formatScreenshots(gameData.screenshots) : [],
        genres: gameData.genres || [],
        platforms: gameData.platforms || [],
        companies: (gameData.involved_companies) ? await formatCompanies(gameData.involved_companies) : []
      }

      game.keywords = generateKeywords(game.genres, game.platforms, game.summary, game.storyline, game.name)

      return game
    } else {
      throw new Error(`${id} - error on loading this game`)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}
