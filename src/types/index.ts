import { Article, Category, Tag, User, League, Team, Match, Standing } from '@prisma/client'

export type MatchWithTeams = Match & {
  homeTeam: Team
  awayTeam: Team
  league: League
}

export type ArticleWithRelations = Article & {
  author?: User | null
  category: Category
  league?: League | null
  tags: Tag[]
  match?: MatchWithTeams | null
}

export type CategoryWithCount = Category & {
  _count: {
    articles: number
  }
}

export type StandingWithTeam = Standing & {
  team: Team
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchParams {
  page?: string
  category?: string
  league?: string
  tag?: string
  q?: string
}
