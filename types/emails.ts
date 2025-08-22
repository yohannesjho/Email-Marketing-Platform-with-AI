export type Recipients = {
  id: string;
  name: string;
  email: string;
  tags: string[];

}

export enum Status {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  FAILED = "FAILED"
}

export type Email = {
  id?: string;
  subject: string;
  body: string;
  status: Status;
  scheduledAt?: string;
  recipients?: Recipients[];
  createdAt?: string;
};

 
