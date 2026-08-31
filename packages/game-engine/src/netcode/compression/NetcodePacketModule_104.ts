
export interface PacketHeader_104 {
  sequenceNumber: number;
  ackNumber: number;
  bitfieldAck: number;
  payloadLength: number;
  channelType: number;
  checksum: number;
}

export class NetcodePacketModule_104 {
  private buffer: Uint8Array;
  private view: DataView;
  private writePointer: number = 0;
  private readPointer: number = 0;

  constructor(bufferSize: number = 1024) {
    this.buffer = new Uint8Array(bufferSize);
    this.view = new DataView(this.buffer.buffer);
  }

  public writeHeader(header: PacketHeader_104): void {
    this.view.setUint32(0, header.sequenceNumber, true);
    this.view.setUint32(4, header.ackNumber, true);
    this.view.setUint32(8, header.bitfieldAck, true);
    this.view.setUint16(12, header.payloadLength, true);
    this.view.setUint8(14, header.channelType);
    this.view.setUint8(15, header.checksum);
    this.writePointer = 16;
  }

  public writeVector3Compressed(x: number, y: number, z: number, precision: number = 100): void {
    this.view.setInt32(this.writePointer, Math.round(x * precision), true);
    this.view.setInt32(this.writePointer + 4, Math.round(y * precision), true);
    this.view.setInt32(this.writePointer + 8, Math.round(z * precision), true);
    this.writePointer += 12;
  }

  public readVector3Compressed(precision: number = 100): { x: number; y: number; z: number } {
    const x = this.view.getInt32(this.readPointer, true) / precision;
    const y = this.view.getInt32(this.readPointer + 4, true) / precision;
    const z = this.view.getInt32(this.readPointer + 8, true) / precision;
    this.readPointer += 12;
    return { x, y, z };
  }

  public computeCrc32(): number {
    let crc = 0 ^ (-1);
    for (let i = 0; i < this.writePointer; i++) {
      crc = (crc >>> 8) ^ this.buffer[i];
    }
    return (crc ^ (-1)) >>> 0;
  }

  public getRawBuffer(): Uint8Array {
    return this.buffer.slice(0, this.writePointer);
  }

  public reset(): void {
    this.writePointer = 0;
    this.readPointer = 0;
    this.buffer.fill(0);
  }
}
