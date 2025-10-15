// Export data utilities for CSV/JSON export

import type { CallLog, Payment, Lead } from './supabase'

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item[header]
      // Escape quotes and wrap in quotes if contains comma
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  const headerRow = headers.join(',')
  return [headerRow, ...rows].join('\n')
}

/**
 * Download file in browser
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export call logs to CSV
 */
export function exportCallLogsToCSV(calls: CallLog[]) {
  const headers = [
    'id',
    'created_at',
    'user_id',
    'message_type',
    'user_message',
    'ai_response',
    'tokens_used',
    'tts_chars',
    'duration_ms',
  ]

  const csv = convertToCSV(calls, headers)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `call-logs-${timestamp}.csv`, 'text/csv')
}

/**
 * Export payments to CSV
 */
export function exportPaymentsToCSV(payments: Payment[]) {
  const headers = [
    'id',
    'created_at',
    'full_name',
    'email',
    'amount',
    'currency',
    'plan',
    'verified',
    'transaction_id',
    'flutterwave_tx_ref',
  ]

  const csv = convertToCSV(payments, headers)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `payments-${timestamp}.csv`, 'text/csv')
}

/**
 * Export leads to CSV
 */
export function exportLeadsToCSV(leads: Lead[]) {
  const headers = [
    'id',
    'created_at',
    'name',
    'business',
    'contact',
    'lead_source',
    'notes',
  ]

  const csv = convertToCSV(leads, headers)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `leads-${timestamp}.csv`, 'text/csv')
}

/**
 * Export call logs to JSON
 */
export function exportCallLogsToJSON(calls: CallLog[]) {
  const json = JSON.stringify(calls, null, 2)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `call-logs-${timestamp}.json`, 'application/json')
}

/**
 * Export payments to JSON
 */
export function exportPaymentsToJSON(payments: Payment[]) {
  const json = JSON.stringify(payments, null, 2)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `payments-${timestamp}.json`, 'application/json')
}

/**
 * Export leads to JSON
 */
export function exportLeadsToJSON(leads: Lead[]) {
  const json = JSON.stringify(leads, null, 2)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `leads-${timestamp}.json`, 'application/json')
}

/**
 * Export dashboard stats summary to JSON
 */
export function exportDashboardSummary(stats: any) {
  const summary = {
    exported_at: new Date().toISOString(),
    stats,
  }
  const json = JSON.stringify(summary, null, 2)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `dashboard-summary-${timestamp}.json`, 'application/json')
}
