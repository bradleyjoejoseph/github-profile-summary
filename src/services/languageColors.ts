export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Bash: '#89e051',
  PowerShell: '#012456',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Luau: '#00A2FF',
  R: '#198CE7',
  Julia: '#a270ba',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Scala: '#c22d40',
  Perl: '#0298c3',
  CoffeeScript: '#244776',
  OCaml: '#ef7a08',
  Zig: '#ec915c',
  Solidity: '#AA6746',
  Nix: '#7e7eff',
  Vim: '#199f4b',
  'Vim Script': '#199f4b',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  TeX: '#3D6117',
  MATLAB: '#e16737',
  Groovy: '#4298b8',
  Assembly: '#6E4C13',
  Objective: '#438eff',
  'Objective-C': '#438eff',
  D: '#ba595e',
  FSharp: '#b845fc',
  Elm: '#60B5CC',
  PureScript: '#1D222D',
  Crystal: '#000100',
  Nim: '#ffc200',
  Vala: '#a56de2',
  GDScript: '#355570',
  Markdown: '#083fa1',
  JSON: '#292929',
  YAML: '#cb171e',
  XML: '#0060ac',
  SQL: '#e38c00',
  GraphQL: '#e10098',
};

// Array of vibrant fallbacks for unknown languages
const FALLBACK_PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'
];

export function getLanguageColor(languageName: string | null): string {
  if (!languageName) return '#6b7280';
  if (GITHUB_LANGUAGE_COLORS[languageName]) {
    return GITHUB_LANGUAGE_COLORS[languageName];
  }
  // Generate consistent hash-based color
  let hash = 0;
  for (let i = 0; i < languageName.length; i++) {
    hash = languageName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_PALETTE.length;
  return FALLBACK_PALETTE[index];
}
