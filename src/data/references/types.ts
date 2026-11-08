export interface HttpStatusEntry {
  code: number;
  name: string;
  category: 'Informational' | 'Success' | 'Redirection' | 'Client error' | 'Server error';
  meaning: string;
  usage: string;
  source: string;
  deprecated?: boolean;
}

export interface MimeEntry {
  type: string;
  extensions: string[];
  category: string;
  description: string;
  note?: string;
}

export interface CommandEntry {
  command: string;
  title: string;
  description: string;
  example: string;
  caution?: string;
  docsUrl: string;
}

export interface RegexEntry {
  token: string;
  name: string;
  description: string;
  example: string;
  source: string;
}
