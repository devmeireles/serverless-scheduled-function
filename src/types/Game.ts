export type GameBase = {
    id?: string;
    name?: string;
    slug?: string;
    storyline?: string;
    summary?: string;
    /* eslint-disable camelcase */
    first_release_date?: number;
    cover?: GameImage;
    screenshots: GameImage[];
    genres: GameGenre[];
    platforms: GamePlatform[];
    involved_companies: GameCompany[];
}

export type Game = {
    id?: string;
    name?: string;
    slug?: string;
    storyline?: string;
    summary?: string;
    firstReleaseDate?: number;
    cover?: string;
    screenshots: string[];
    genres: GameGenre[];
    platforms: GamePlatform[];
    keywords?: string[];
    companies: GameCompany[];
}

export type GameImage = {
    id: number;
    game: number;
    height: number;
    /* eslint-disable camelcase */
    image_id: string;
    url: string;
    width: number;
}

export type GameGenre = {
    id: number;
    name: string;
}

export type GamePlatform = {
    id: number;
    abbreviation: string;
}

export type GameCompany = {
    id: number;
    company?: number;
    name?: string;
    created_at?: number;
    developer?: boolean;
    game?: number;
    porting?: boolean;
    publisher?: boolean;
    supporting?: boolean;
    updated_at?: number;
    checksum?: string;
}
