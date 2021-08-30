import { generateRandomGame, generateGameByID } from '../models/GameModel'
import handler from '../../libs/handler'
import { Game } from 'src/types/Game'
import { APIGatewayEvent } from 'aws-lambda'

/**
 * Gets a random game and insert on database
 */
export const getRandomGame = handler(
  async (): Promise<Game> => {
    return generateRandomGame()
  }
)

export const getGameByID = handler(
  async (event: APIGatewayEvent): Promise<Game> => {
    const id = Number(event.pathParameters.id)
    return generateGameByID(id)
  }
)
