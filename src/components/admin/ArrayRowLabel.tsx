'use client'

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

/** Shows the item title instead of Payload's default "Toggle block". */
export default function ArrayRowLabel(_props: RowLabelProps) {
  const { data, rowNumber } = useRowLabel<{
    title?: string
    name?: string
    question?: string
    label?: string
    author?: string
    value?: string
  }>()

  const text =
    data?.title ||
    data?.name ||
    data?.question ||
    data?.label ||
    data?.author ||
    (data?.value ? String(data.value) : '') ||
    `Item ${String(rowNumber ?? 1).padStart(2, '0')}`

  return <span>{text}</span>
}
