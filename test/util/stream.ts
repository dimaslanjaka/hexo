import Promise from 'bluebird';

export function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';

    stream
      .on('data', (chunk: { toString: () => string }) => {
        data += chunk.toString();
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', reject);
  });
}
