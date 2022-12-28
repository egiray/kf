export interface SiteInfo {
  id: string;
  name: string;
  devices: {
    id: string;
    name: string
  }[]
}

export type Outages = {
  id: string
  name?: string
  begin: string
  end: string
}[]