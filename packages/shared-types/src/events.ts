import { GameSnapshot, PlayerInputFrame } from './game';
import { MatchmakingTicket, MatchmakingMatch } from './matchmaking';
import { UserProfile } from './player';

export interface ChatMessagePayload {
  id: string;
  senderId: string;
  senderName: string;
  clanTag?: string;
  channel: 'GLOBAL' | 'PARTY' | 'CLAN' | 'MATCH' | 'WHISPER';
  recipientId?: string;
  content: string;
  timestamp: number;
}

export interface ClientToServerEvents {
  'player:join_lobby': (token: string) => void;
  'matchmaking:queue': (data: { gameType: string; gameMode: string }) => void;
  'matchmaking:cancel': () => void;
  'matchmaking:accept': (matchId: string) => void;
  'game:join_room': (data: { matchId: string }) => void;
  'game:send_input': (frame: PlayerInputFrame) => void;
  'game:leave_room': (matchId: string) => void;
  'chat:send_message': (payload: Omit<ChatMessagePayload, 'id' | 'senderId' | 'senderName' | 'timestamp'>) => void;
}

export interface ServerToClientEvents {
  'system:init_state': (data: { profile: UserProfile }) => void;
  'matchmaking:ticket_update': (ticket: MatchmakingTicket) => void;
  'matchmaking:match_found': (match: MatchmakingMatch) => void;
  'matchmaking:match_cancelled': (reason: string) => void;
  'game:state_snapshot': (snapshot: GameSnapshot) => void;
  'game:player_joined': (player: { id: string; username: string }) => void;
  'game:player_left': (playerId: string) => void;
  'game:match_end': (result: any) => void;
  'chat:new_message': (message: ChatMessagePayload) => void;
  'error:notification': (error: { code: string; message: string }) => void;
}
