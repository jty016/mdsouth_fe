export enum VisitStatus {
  'intact',
  'visited',
  'met',
  'noVisit',
}

export interface HouseholdProps {
  id: number;
  name: string;
  status: VisitStatus;
  isLock?: boolean;
}

export interface GateProps {
  id: number
  address: string;
  buildingName: string;
  gateName: string;
  households: Array<HouseholdProps>;
}
