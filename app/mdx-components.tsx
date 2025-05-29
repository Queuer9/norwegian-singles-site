import SuperscriptNote from './components/SuperscriptNote'

export function useMDXComponents(components: any) {
  return {
    ...components,
    SuperscriptNote,
  }
} 