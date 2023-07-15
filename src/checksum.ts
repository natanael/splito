import { type Hash, createHash } from 'crypto'
import { type FSWatcher, createReadStream, watch as fsWatch } from 'fs'
import { EventEmitter } from 'events';

export class ChecksumEmitter extends EventEmitter {
  hash: string = '';
  fsWatcher: FSWatcher | null = null;
  constructor(private filepath: string, private algorithm: string = 'sha1') {
    super();
    this.startWatching();
  }

  close() {
    this.fsWatcher?.close();
  }

  private checkSum(onEnd: (hash: string) => void) {
    const hash: Hash = createHash(this.algorithm).setEncoding('hex')
      .once('finish', () =>  onEnd(hash.read()))
    createReadStream(this.filepath)
      .once('error', (error: any) => this.emit('error', error))
      .pipe(hash);
  }

  private startWatching() {
    this.checkSum((prevHash) => {
      this.hash = prevHash;
      this.fsWatcher = fsWatch(this.filepath, (event, filepath) => {
        if (event === 'change' && filepath === this.filepath) {
          this.handleFileChange(filepath);
        }
      });
    })
  }

  private handleFileChange = (filepath: string) => {
    this.checkSum((newHash) => {
      if (newHash !== this.hash) {
        this.hash = newHash;
        this.emit('checksumChanged', newHash);
      }
    });
  }
}