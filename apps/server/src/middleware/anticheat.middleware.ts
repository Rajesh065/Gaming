import { Request, Response, NextFunction } from 'express';
import { AntiCheatReport } from '@nexusplay/shared-types';

export const suspiciousPacketsLog: AntiCheatReport[] = [];

export const antiCheatSanityCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const packetTime = req.body?.timestamp;
  if (packetTime) {
    const diff = Math.abs(Date.now() - packetTime);
    if (diff > 10000) {
      // 10s timestamp spoofing alert
      suspiciousPacketsLog.push({
        id: `ac-${Date.now()}`,
        userId: (req as any).user?.id || 'anonymous',
        username: (req as any).user?.username || 'anonymous',
        gameType: req.body?.gameType || 'UNKNOWN',
        violationType: 'INVALID_PACKET_RATE',
        confidenceScore: 0.92,
        snapshotData: { clientTime: packetTime, serverTime: Date.now(), delta: diff },
        timestamp: new Date().toISOString(),
        isReviewed: false
      });
    }
  }
  next();
};
