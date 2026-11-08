import {
  useEffect,
  useState,
  type ComponentType,
} from 'react';
import type { ToolClientConfig, ToolEngine } from '../../data/tools';

export interface ToolProps {
  tool: ToolClientConfig;
}

const loaders: Record<
  ToolEngine,
  () => Promise<{ default: ComponentType<ToolProps> }>
> = {
  text: () => import('./TextTool'),
  json: () => import('./JsonTool'),
  csv: () => import('./CsvTool'),
  yaml: () => import('./DataFormatTool'),
  xml: () => import('./DataFormatTool'),
  markdown: () => import('./MarkdownTool'),
  hash: () => import('./MiscTools'),
  uuid: () => import('./MiscTools'),
  unicode: () => import('./MiscTools'),
  jwt: () => import('./JwtTool'),
  regex: () => import('./RegexTool'),
  diff: () => import('./DiffTool'),
  timestamp: () => import('./DateTimeTool'),
  'date-diff': () => import('./DateTimeTool'),
  timezone: () => import('./DateTimeTool'),
  cron: () => import('./CronTool'),
  calculator: () => import('./CalculatorTool'),
  'number-base': () => import('./NumberBaseTool'),
  unit: () => import('./UnitTool'),
  color: () => import('./ColorTool'),
  gradient: () => import('./ColorTool'),
  contrast: () => import('./ColorTool'),
  mermaid: () => import('./MermaidTool'),
  subnet: () => import('./SubnetTool'),
  sql: () => import('./SqlTool'),
  reference: () => import('./ReferenceTool'),
  playground: () => import('./PlaygroundTool'),
  'decision-table': () => import('./DecisionTableTool'),
};

export default function ToolLoader({ tool }: ToolProps) {
  const [Component, setComponent] = useState<ComponentType<ToolProps> | null>(
    null,
  );
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setComponent(null);
    setError('');
    loaders[tool.engine]()
      .then((module) => {
        if (active) setComponent(() => module.default);
      })
      .catch(() => {
        if (active) {
          setError(
            'The tool could not load. Check your connection and reload the page; no input has been sent anywhere.',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [tool.engine]);

  if (error) {
    return (
      <div className="tool-error" role="alert">
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="tool-loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        Loading the local tool…
      </div>
    );
  }

  return (
    <div data-clarity-mask="true">
      <Component tool={tool} />
    </div>
  );
}
