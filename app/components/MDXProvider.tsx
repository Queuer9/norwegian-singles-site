'use client'

import React from 'react'
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react'
import { useMDXComponents } from '../mdx-components'

export default function MDXProvider({ children }: { children: React.ReactNode }) {
  const components = useMDXComponents({})
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>
} 