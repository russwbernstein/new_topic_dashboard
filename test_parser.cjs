const fs = require('fs');

const rawCsv = fs.readFileSync('src/data/tousandtopics0501.csv', 'utf-8');

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

const lines = rawCsv.trim().split(/\r?\n/);
const headers = parseCsvLine(lines[0] || '');
console.log("Headers:", headers);

function getColumnIndex(headers, candidates, fallback) {
  const normalizedHeaders = headers.map((header) => header.trim().toLowerCase());
  const index = candidates.findIndex((candidate) => normalizedHeaders.includes(candidate.toLowerCase()));

  if (index === -1) return fallback;
  return normalizedHeaders.indexOf(candidates[index].toLowerCase());
}

const idIndex = getColumnIndex(headers, ['pandora_topic_id', 'topic_id', 'id'], 1);
const nameIndex = getColumnIndex(headers, ['topic_term', 'term', 'name'], 0);
const volumeIndex = getColumnIndex(headers, ['cnt', 'volume', 'tag_volume'], 2);

console.log(`idIndex: ${idIndex}, nameIndex: ${nameIndex}, volumeIndex: ${volumeIndex}`);

const firstDataRow = parseCsvLine(lines[1]);
console.log("First data row parsed:", firstDataRow);
console.log("cells[nameIndex]:", firstDataRow[nameIndex], "cells[idIndex]:", firstDataRow[idIndex]);

const validRows = lines.slice(1).map(parseCsvLine).filter((cells) => cells[nameIndex] && cells[idIndex]);
console.log(`Total valid rows found: ${validRows.length}`);

