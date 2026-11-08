import type { RegexEntry } from './types';

const raw = String.raw;
const SOURCE =
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet';

function entry(
  token: string,
  name: string,
  description: string,
  example: string,
): RegexEntry {
  return { token, name, description, example, source: SOURCE };
}

export const REGEX_TOKENS: RegexEntry[] = [
  entry('abc', 'Literal text', 'Matches the characters exactly, in sequence.', raw`/abc/`),
  entry('.', 'Any character', 'Matches any single character except line terminators unless the s flag is used.', raw`/a.c/`),
  entry(raw`\d`, 'Digit', 'Matches an ASCII digit from 0 to 9.', raw`/\d{3}/`),
  entry(raw`\D`, 'Non-digit', 'Matches any character that is not an ASCII digit.', raw`/\D+/`),
  entry(raw`\w`, 'Word character', 'Matches a letter, digit, or underscore in the ASCII range.', raw`/\w+/`),
  entry(raw`\W`, 'Non-word character', 'Matches whitespace, punctuation, and other non-word characters.', raw`/\W/`),
  entry(raw`\s`, 'Whitespace', 'Matches spaces, tabs, line breaks, and other Unicode whitespace.', raw`/\s+/`),
  entry(raw`\S`, 'Non-whitespace', 'Matches any character that is not whitespace.', raw`/\S+/`),
  entry('[abc]', 'Character set', 'Matches one character from the listed set.', raw`/[abc]/`),
  entry('[^abc]', 'Negated set', 'Matches one character that is not in the set.', raw`/[^abc]/`),
  entry('[a-z]', 'Range', 'Matches a character within an inclusive range.', raw`/[a-z]+/`),
  entry('^', 'Start anchor', 'Asserts the start of the string, or the start of a line with the m flag.', raw`/^Hello/`),
  entry('$', 'End anchor', 'Asserts the end of the string, or the end of a line with the m flag.', raw`/world$/`),
  entry(raw`\b`, 'Word boundary', 'Asserts a position between a word character and a non-word character.', raw`/\bcat\b/`),
  entry(raw`\B`, 'Non-word boundary', 'Asserts a position that is not a word boundary.', raw`/\Bcat/`),
  entry('*', 'Zero or more', 'Repeats the previous token zero or more times, greedily.', raw`/a*/`),
  entry('+', 'One or more', 'Repeats the previous token one or more times, greedily.', raw`/a+/`),
  entry('?', 'Optional', 'Matches the previous token zero or one time.', raw`/colou?r/`),
  entry('{n}', 'Exactly n', 'Matches exactly n repetitions of the previous token.', raw`/a{3}/`),
  entry('{n,}', 'At least n', 'Matches n or more repetitions.', raw`/a{2,}/`),
  entry('{n,m}', 'Between n and m', 'Matches between n and m repetitions.', raw`/a{2,4}/`),
  entry('*?', 'Lazy zero or more', 'Repeats zero or more times but prefers the shortest match.', raw`/<.*?>/`),
  entry('+?', 'Lazy one or more', 'Repeats one or more times but prefers the shortest match.', raw`/".+?"/`),
  entry('??', 'Lazy optional', 'Prefers zero occurrences when both zero and one can match.', raw`/a??/`),
  entry('(abc)', 'Capturing group', 'Groups a sequence and captures its matched text.', raw`/(ab)+/`),
  entry('(?:abc)', 'Non-capturing group', 'Groups a sequence without storing a capture.', raw`/(?:ab)+/`),
  entry('(?<name>abc)', 'Named capture group', 'Captures the group under a readable name.', raw`/(?<year>\d{4})/`),
  entry(raw`\1`, 'Backreference', 'Matches the same text captured earlier by a numbered group.', raw`/(\w+)\s+\1/`),
  entry('(?=abc)', 'Positive lookahead', 'Asserts that the following text matches without consuming it.', raw`/\d+(?=px)/`),
  entry('(?!abc)', 'Negative lookahead', 'Asserts that the following text does not match.', raw`/\d+(?!px)/`),
  entry('(?<=abc)', 'Positive lookbehind', 'Asserts that the preceding text matches without consuming it.', raw`/(?<=\$)\d+/`),
  entry('(?<!abc)', 'Negative lookbehind', 'Asserts that the preceding text does not match.', raw`/(?<!\$)\d+/`),
  entry('|', 'Alternation', 'Matches either the expression on the left or the right.', raw`/cat|dog/`),
  entry(raw`\.`, 'Escaped literal', 'Removes the special meaning of a regex metacharacter.', raw`/3\.14/`),
  entry('(...)', 'Group and quantifier scope', 'Groups expressions so a quantifier applies to the whole group instead of one character.', raw`/(ab){2}/`),
];

export const REGEX_FLAGS = [
  { flag: 'g', name: 'Global', description: 'Find all matches rather than stopping after the first.' },
  { flag: 'i', name: 'Ignore case', description: 'Match letters case-insensitively.' },
  { flag: 'm', name: 'Multiline', description: 'Make ^ and $ match the start and end of each line.' },
  { flag: 's', name: 'Dot all', description: 'Allow the dot to match line terminators.' },
  { flag: 'u', name: 'Unicode', description: 'Enable Unicode-aware matching and escapes.' },
  { flag: 'y', name: 'Sticky', description: 'Match starting exactly at lastIndex.' },
] as const;
