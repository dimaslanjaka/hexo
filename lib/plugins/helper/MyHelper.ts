import fs from 'fs';
import path from 'path';

class MyHelper {
  static log_to_file(id: string, ...args: any[]) {
    const file = path.join(process.cwd(), `tmp/logs/${id}.log`);
    const content = args
      .map((arg) => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'number') return String(arg);
        if (typeof arg === 'boolean') return String(arg);
        return JSON.stringify(arg, null, 2);
      })
      .join(' ');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, content + '\n', 'utf8');
  }
}

// For ESM compatibility
export default MyHelper;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = MyHelper;
  // For ESM compatibility
  module.exports.default = MyHelper;
}
