const body = $json.Body || $json.body?.Body;
const sender = $json.From || $json.body?.From;

if (!body) {
  throw new Error("Missing 'Body' in incoming request.");
}

let command = 'UNKNOWN';
let sourcePath = '';
let destinationPath = '';

const trimmed = body.trim();

if (/^LIST\s+.+/i.test(trimmed)) {
  command = 'LIST';
  sourcePath = trimmed.split(/\s+/)[1];
} else if (/^DELETE\s+.+\s+CONFIRM$/i.test(trimmed)) {
  command = 'DELETE';
  sourcePath = trimmed.match(/^DELETE\s+(.+)\s+CONFIRM$/i)[1].trim();
} else if (/^MOVE\s+.+\s+.+/i.test(trimmed)) {
  const parts = trimmed.split(/\s+/);
  command = 'MOVE';
  sourcePath = parts[1];
  destinationPath = parts[2];
} else if (/^SUMMARY\s+.+/i.test(trimmed)) {
  command = 'SUMMARY';
  sourcePath = trimmed.split(/\s+/)[1];
}

return [
  {
    json: {
      command,
      sourcePath,
      destinationPath,
      sender: sender || "unknown",
      rawMessage: trimmed
    }
  }
];
