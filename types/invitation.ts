export interface InvitationData {
  clientEmail: string;
  groom: string;
  bride: string;
  date: string;
  time: string;
  dateTime: string;
  venue: string;
  address: string;
  coverImage: string;
  gallery: string[];
  events: {
    time: string;
    title: string;
  }[];
}