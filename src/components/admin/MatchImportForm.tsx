'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2, Calendar, Trophy } from 'lucide-react'
import { League, Category, Match, Team } from '@prisma/client'

interface MatchImportFormProps {
  leagues: (League & { category: Category })[]
  recentMatches: (Match & { homeTeam: Team; awayTeam: Team; league: League })[]
}

interface MatchEntry {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: string
  awayScore: string
  matchDate: string
  matchTime: string
  status: string
  venue: string
  leagueId: string
}

const emptyMatch = (): MatchEntry => ({
  id: Math.random().toString(36).substr(2, 9),
  homeTeam: '',
  awayTeam: '',
  homeScore: '',
  awayScore: '',
  matchDate: new Date().toISOString().split('T')[0],
  matchTime: '15:00',
  status: 'SCHEDULED',
  venue: '',
  leagueId: '',
})

export default function MatchImportForm({
  leagues,
  recentMatches,
}: MatchImportFormProps) {
  const [matches, setMatches] = useState<MatchEntry[]>([emptyMatch()])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{
    imported: number
    updated: number
    failed: number
  } | null>(null)

  const addMatch = () => {
    setMatches([...matches, emptyMatch()])
  }

  const removeMatch = (id: string) => {
    if (matches.length > 1) {
      setMatches(matches.filter(m => m.id !== id))
    }
  }

  const updateMatch = (id: string, field: keyof MatchEntry, value: string) => {
    setMatches(matches.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const handleImport = async () => {
    // Validate
    const validMatches = matches.filter(
      m => m.homeTeam && m.awayTeam && m.leagueId && m.matchDate
    )

    if (validMatches.length === 0) {
      alert('Please fill in at least one complete match')
      return
    }

    setImporting(true)
    setResult(null)

    try {
      const res = await fetch('/api/import/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matches: validMatches.map(m => ({
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            homeScore: m.homeScore ? parseInt(m.homeScore) : null,
            awayScore: m.awayScore ? parseInt(m.awayScore) : null,
            matchDate: new Date(`${m.matchDate}T${m.matchTime}`),
            status: m.status,
            venue: m.venue || null,
            leagueId: m.leagueId,
          })),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
        setMatches([emptyMatch()])
      } else {
        alert(data.error || 'Failed to import matches')
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import matches')
    } finally {
      setImporting(false)
    }
  }

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'LIVE', label: 'Live' },
    { value: 'FINISHED', label: 'Finished' },
    { value: 'POSTPONED', label: 'Postponed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      {/* Result message */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Import complete: {result.imported} new, {result.updated} updated, {result.failed} failed
          </p>
        </div>
      )}

      {/* Match entries */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add Matches</h2>
          <button
            onClick={addMatch}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Match
          </button>
        </div>

        <div className="p-4 space-y-4">
          {matches.map((match, index) => (
            <div
              key={match.id}
              className="p-4 border border-slate-200 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  Match #{index + 1}
                </span>
                {matches.length > 1 && (
                  <button
                    onClick={() => removeMatch(match.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* League */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    League *
                  </label>
                  <select
                    value={match.leagueId}
                    onChange={e => updateMatch(match.id, 'leagueId', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select League</option>
                    {leagues.map(league => (
                      <option key={league.id} value={league.id}>
                        {league.category.name} - {league.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={match.status}
                    onChange={e => updateMatch(match.id, 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={match.venue}
                    onChange={e => updateMatch(match.id, 'venue', e.target.value)}
                    placeholder="Stadium name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Home Team */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Home Team *
                  </label>
                  <input
                    type="text"
                    value={match.homeTeam}
                    onChange={e => updateMatch(match.id, 'homeTeam', e.target.value)}
                    placeholder="Team name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Score */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={match.homeScore}
                    onChange={e => updateMatch(match.id, 'homeScore', e.target.value)}
                    placeholder="-"
                    className="w-16 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                  />
                  <span className="text-slate-400">:</span>
                  <input
                    type="number"
                    min="0"
                    value={match.awayScore}
                    onChange={e => updateMatch(match.id, 'awayScore', e.target.value)}
                    placeholder="-"
                    className="w-16 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                  />
                </div>

                {/* Away Team */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Away Team *
                  </label>
                  <input
                    type="text"
                    value={match.awayTeam}
                    onChange={e => updateMatch(match.id, 'awayTeam', e.target.value)}
                    placeholder="Team name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={match.matchDate}
                    onChange={e => updateMatch(match.id, 'matchDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={match.matchTime}
                    onChange={e => updateMatch(match.id, 'matchTime', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 rounded-lg transition"
          >
            {importing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trophy className="w-5 h-5" />
            )}
            {importing ? 'Importing...' : 'Import Matches'}
          </button>
        </div>
      </div>

      {/* Recent matches */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Matches</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentMatches.map(match => (
            <div key={match.id} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <span>{match.league.name}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    match.status === 'FINISHED' ? 'bg-green-100 text-green-700' :
                    match.status === 'LIVE' ? 'bg-red-100 text-red-700' :
                    match.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{match.homeTeam.name}</span>
                  <span className="text-lg font-bold text-slate-900">
                    {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                  </span>
                  <span className="font-medium">{match.awayTeam.name}</span>
                </div>
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(match.matchDate).toLocaleDateString()}
              </div>
            </div>
          ))}
          {recentMatches.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No matches imported yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
