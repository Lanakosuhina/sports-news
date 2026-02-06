'use client'

import { useState } from 'react'
import { RefreshCw, Database, Trophy, Calendar, Users, Check, AlertCircle, Loader2 } from 'lucide-react'

interface League {
  id: string
  name: string
  slug: string
  country: string | null
  logo: string | null
  category: {
    id: string
    name: string
  }
  _count: {
    matches: number
    standings: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface FootballImportDashboardProps {
  leagues: League[]
  categories: Category[]
}

// League mapping to API-Sports IDs
const LEAGUE_API_MAPPING: Record<string, { apiId: number; name: string }> = {
  // Russia
  'rpl': { apiId: 235, name: 'Russian Premier League' },
  'kubok-rossii': { apiId: 236, name: 'Russian Cup' },
  // England
  'apl': { apiId: 39, name: 'Premier League' },
  // Spain
  'la-liga': { apiId: 140, name: 'La Liga' },
  // Germany
  'bundesliga': { apiId: 78, name: 'Bundesliga' },
  // Italy
  'seriya-a': { apiId: 135, name: 'Serie A' },
  // France
  'liga-1': { apiId: 61, name: 'Ligue 1' },
  // European competitions
  'liga-chempionov': { apiId: 2, name: 'Champions League' },
  'liga-evropyi': { apiId: 3, name: 'Europa League' },
  'liga-konferenciy': { apiId: 848, name: 'Conference League' },
}

export default function FootballImportDashboard({
  leagues,
  categories,
}: FootballImportDashboardProps) {
  const [syncing, setSyncing] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [options, setOptions] = useState({
    syncTeams: true,
    syncStandings: true,
    syncFixtures: true,
    fixturesDays: 30,
  })

  const syncLeague = async (leagueSlug: string) => {
    setSyncing(leagueSlug)
    setResults((prev) => ({ ...prev, [leagueSlug]: { success: false, message: 'Синхронизация...' } }))

    try {
      const response = await fetch('/api/football', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync-league',
          leagueSlug,
          options,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const { teams, standings, fixtures } = data.result
        setResults((prev) => ({
          ...prev,
          [leagueSlug]: {
            success: true,
            message: `Команды: +${teams.imported}/~${teams.updated}, Таблица: +${standings.imported}/~${standings.updated}, Матчи: +${fixtures.imported}/~${fixtures.updated}`,
          },
        }))
      } else {
        setResults((prev) => ({
          ...prev,
          [leagueSlug]: { success: false, message: data.error || 'Ошибка синхронизации' },
        }))
      }
    } catch {
      setResults((prev) => ({
        ...prev,
        [leagueSlug]: { success: false, message: 'Ошибка сети' },
      }))
    } finally {
      setSyncing(null)
    }
  }

  const syncAllLeagues = async () => {
    const mappedLeagues = leagues.filter((l) => LEAGUE_API_MAPPING[l.slug])
    for (const league of mappedLeagues) {
      await syncLeague(league.slug)
    }
  }

  const leaguesWithMapping = leagues.map((league) => ({
    ...league,
    apiMapping: LEAGUE_API_MAPPING[league.slug],
  }))

  const mappedLeagues = leaguesWithMapping.filter((l) => l.apiMapping)
  const unmappedLeagues = leaguesWithMapping.filter((l) => !l.apiMapping)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Импорт футбольных данных</h1>
          <p className="text-slate-600 mt-1">
            Синхронизация команд, турнирных таблиц и матчей из API-Sports
          </p>
        </div>
        <button
          onClick={syncAllLeagues}
          disabled={syncing !== null}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {syncing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Синхронизировать все
        </button>
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold text-slate-900 mb-3">Настройки синхронизации</h2>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.syncTeams}
              onChange={(e) => setOptions((prev) => ({ ...prev, syncTeams: e.target.checked }))}
              className="rounded"
            />
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm">Команды</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.syncStandings}
              onChange={(e) => setOptions((prev) => ({ ...prev, syncStandings: e.target.checked }))}
              className="rounded"
            />
            <Trophy className="w-4 h-4 text-slate-500" />
            <span className="text-sm">Турнирная таблица</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.syncFixtures}
              onChange={(e) => setOptions((prev) => ({ ...prev, syncFixtures: e.target.checked }))}
              className="rounded"
            />
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm">Матчи</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Дней:</span>
            <input
              type="number"
              value={options.fixturesDays}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, fixturesDays: parseInt(e.target.value) || 30 }))
              }
              className="w-16 px-2 py-1 border rounded text-sm"
              min={1}
              max={365}
            />
          </label>
        </div>
      </div>

      {/* Mapped Leagues */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 text-white">
          <h2 className="font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Связанные лиги ({mappedLeagues.length})
          </h2>
        </div>
        <div className="divide-y">
          {mappedLeagues.map((league) => (
            <div key={league.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                {league.logo && (
                  <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain" />
                )}
                <div>
                  <div className="font-medium text-slate-900">{league.name}</div>
                  <div className="text-sm text-slate-500">
                    API: {league.apiMapping?.name} (ID: {league.apiMapping?.apiId}) •{' '}
                    {league.country || 'Международный'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Матчей: {league._count.matches} • Позиций в таблице: {league._count.standings}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {results[league.slug] && (
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      results[league.slug].success ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {results[league.slug].success ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="max-w-xs truncate">{results[league.slug].message}</span>
                  </div>
                )}
                <button
                  onClick={() => syncLeague(league.slug)}
                  disabled={syncing !== null}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition text-sm"
                >
                  {syncing === league.slug ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Синхронизировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unmapped Leagues */}
      {unmappedLeagues.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-700 text-white">
            <h2 className="font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Лиги без связи с API ({unmappedLeagues.length})
            </h2>
          </div>
          <div className="divide-y">
            {unmappedLeagues.map((league) => (
              <div key={league.id} className="p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  {league.logo && (
                    <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain" />
                  )}
                  <div>
                    <div className="font-medium text-slate-900">{league.name}</div>
                    <div className="text-sm text-slate-500">
                      Slug: {league.slug} • {league.country || 'Международный'}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-400">Требуется настройка API ID</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Инструкция</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Добавьте ваш API ключ в .env файл: <code className="bg-blue-100 px-1 rounded">API_SPORTS_KEY=your-key</code></li>
          <li>• Для добавления новых лиг, добавьте их в <code className="bg-blue-100 px-1 rounded">LEAGUE_API_MAPPING</code></li>
          <li>• API ID можно найти на <a href="https://api-sports.io/documentation/football/v3" target="_blank" rel="noopener noreferrer" className="underline">api-sports.io</a></li>
          <li>• Бесплатный тариф: 100 запросов в день</li>
        </ul>
      </div>
    </div>
  )
}
