import { describe, expect, it } from 'vitest';
import { explainSql, formatSql } from '../src/lib/sql';
import { explainCron, nextCronRuns, parseCron } from '../src/lib/cron';

describe('SQL formatting', () => {
  it('formats a common SELECT query into readable clauses', () => {
    const formatted = formatSql(
      "select id, name from users where active = true and role = 'admin' order by name",
    );
    expect(formatted).toContain('SELECT\n  id,\n  name\nFROM users');
    expect(formatted).toContain('WHERE active = TRUE');
    expect(formatted).toContain("\n  AND role = 'admin'");
    expect(formatted).toContain('ORDER BY name');
  });

  it('formats joins and comments without losing them', () => {
    const formatted = formatSql(
      'select u.id from users u left join orders o on o.user_id = u.id -- keep this\nwhere u.active = true',
    );
    expect(formatted).toContain('LEFT JOIN orders o');
    expect(formatted).toContain('ON o.user_id = u.id');
    expect(formatted).toContain('-- keep this');
  });

  it('rejects unclosed strings', () => {
    expect(() => formatSql("select 'unclosed")).toThrow(/not closed/u);
    expect(formatSql('   ')).toBe('');
  });
});

describe('SQL explanations', () => {
  it('explains clauses, tables, and warnings', () => {
    const result = explainSql(
      'SELECT * FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.active = TRUE',
    );
    expect(result.statementType).toBe('SELECT');
    expect(result.clauses.map((clause) => clause.name)).toEqual(
      expect.arrayContaining(['SELECT', 'FROM', 'LEFT JOIN', 'ON', 'WHERE']),
    );
    expect(result.tables).toEqual(expect.arrayContaining(['users', 'orders']));
    expect(result.warnings.join(' ')).toMatch(/SELECT \*/u);
    expect(result.warnings.join(' ')).not.toMatch(/without ON/u);
  });

  it('flags destructive statements without filters', () => {
    const update = explainSql('UPDATE users SET active = FALSE');
    expect(update.warnings.join(' ')).toMatch(/every row/u);
    const deletion = explainSql('DELETE FROM logs');
    expect(deletion.warnings.join(' ')).toMatch(/every row/u);
  });

  it('rejects text without recognizable SQL clauses', () => {
    expect(() => explainSql('please fix this')).toThrow(/No common SQL clause/u);
  });
});

describe('cron parsing', () => {
  it('expands steps and weekdays', () => {
    const parsed = parseCron('*/15 * * * 1-5');
    expect([...parsed.minute.values].sort((a, b) => a - b)).toEqual([
      0, 15, 30, 45,
    ]);
    expect([...parsed.dayOfWeek.values].sort((a, b) => a - b)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('supports macros and seven as Sunday', () => {
    expect(parseCron('@daily').expression).toBe('@daily');
    const sunday = parseCron('0 0 * * 7');
    expect([...sunday.dayOfWeek.values]).toEqual([0]);
  });

  it('rejects invalid expressions', () => {
    expect(() => parseCron('* * * *')).toThrow(/five fields/u);
    expect(() => parseCron('60 * * * *')).toThrow(/0 to 59/u);
    expect(() => parseCron('*/0 * * * *')).toThrow(/greater than zero/u);
    expect(() => parseCron('0 0 * * MONDAY')).toThrow();
  });
});

describe('cron explanations', () => {
  it('describes interval schedules in plain English', () => {
    expect(explainCron('*/15 * * * *').summary).toMatch(/Every 15 minutes/u);
    expect(explainCron('0 */6 * * *').summary).toMatch(/Every 6 hours/u);
    expect(explainCron('0 9 * * 1-5').summary).toMatch(/At 09:00/u);
    expect(explainCron('0 9 * * 1-5').summary).toMatch(/Monday/u);
    expect(explainCron('@daily').summary).toMatch(/At 00:00/u);
  });

  it('mentions the day-of-month/day-of-week OR rule', () => {
    expect(explainCron('0 0 1 * 1').summary).toMatch(/OR rule/u);
  });
});

describe('next cron runs', () => {
  it('returns the next matching times in ascending order', () => {
    const from = new Date(2026, 0, 1, 0, 1, 0);
    const runs = nextCronRuns('*/15 * * * *', from, 5);
    expect(runs).toHaveLength(5);
    expect(runs[0]?.getHours()).toBe(0);
    expect(runs[0]?.getMinutes()).toBe(15);
    expect(runs.every((date) => date.getMinutes() % 15 === 0)).toBe(true);
    expect(runs.every((date) => date.getSeconds() === 0)).toBe(true);
    for (let index = 1; index < runs.length; index += 1) {
      expect(runs[index]!.getTime()).toBeGreaterThan(runs[index - 1]!.getTime());
    }
  });

  it('skips weekends for weekday schedules', () => {
    const runs = nextCronRuns('0 9 * * 1-5', new Date(2026, 0, 4, 12, 0, 0), 5);
    expect(runs).toHaveLength(5);
    runs.forEach((date) => {
      expect([0, 6]).not.toContain(date.getDay());
      expect(date.getHours()).toBe(9);
      expect(date.getMinutes()).toBe(0);
    });
  });

  it('returns no runs for an impossible date', () => {
    expect(nextCronRuns('0 0 30 2 *', new Date(2026, 0, 1), 3)).toEqual([]);
  });
});
