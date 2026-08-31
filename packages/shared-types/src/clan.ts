export enum ClanRole {
  RECRUIT = 'RECRUIT',
  MEMBER = 'MEMBER',
  OFFICER = 'OFFICER',
  CO_LEADER = 'CO_LEADER',
  LEADER = 'LEADER'
}

export interface ClanMember {
  userId: string;
  username: string;
  role: ClanRole;
  contributionXp: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string;
  badgeEmblem: string;
  level: number;
  totalXp: number;
  memberCount: number;
  maxMembers: number;
  leaderId: string;
  members: ClanMember[];
  isRecruiting: boolean;
  minRatingRequired: number;
  createdAt: string;
}
