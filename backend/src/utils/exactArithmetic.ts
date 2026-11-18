/**
 * Exact Rational Arithmetic (No Float Precision Errors)
 * MathCity AI Offline Engine
 * 
 * Uses BigInt for arbitrary-precision exact fractions.
 * 0.1 + 0.2 is strictly 3/10 (0.3).
 */

export class Rational {
  public readonly n: bigint; // numerator
  public readonly d: bigint; // denominator (strictly > 0)

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    let num = typeof numerator === 'number' ? BigInt(Math.round(numerator)) : numerator;
    let den = typeof denominator === 'number' ? BigInt(Math.round(denominator)) : denominator;

    if (den === 0n) {
      throw new Error('Nolga bo‘lish mumkin emas (Division by zero)');
    }

    if (den < 0n) {
      num = -num;
      den = -den;
    }

    const g = Rational.gcd(Rational.absBigInt(num), den);
    this.n = num / g;
    this.d = den / g;
  }

  private static absBigInt(x: bigint): bigint {
    return x < 0n ? -x : x;
  }

  private static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  /**
   * Parse any input string or number into an exact Rational:
   * Examples:
   * "5" -> 5/1
   * "-3" -> -3/1
   * "0.1" -> 1/10
   * "0.25" -> 1/4
   * "3/4" -> 3/4
   * "1 1/2" -> 3/2
   */
  public static from(val: string | number | bigint | Rational): Rational {
    if (val instanceof Rational) return val;
    if (typeof val === 'bigint') return new Rational(val, 1n);
    if (typeof val === 'number') {
      if (Number.isInteger(val)) return new Rational(BigInt(val), 1n);
      return Rational.from(val.toString());
    }

    const s = val.trim();

    // Mixed fraction: "1 1/2" or "-2 3/4"
    const mixedMatch = s.match(/^([+-]?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = BigInt(mixedMatch[1]);
      const num = BigInt(mixedMatch[2]);
      const den = BigInt(mixedMatch[3]);
      const sign = whole < 0n ? -1n : 1n;
      const totalNum = whole * den + (sign * num);
      return new Rational(totalNum, den);
    }

    // Standard fraction: "3/4", "-5/6"
    const fracMatch = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
    if (fracMatch) {
      return new Rational(BigInt(fracMatch[1]), BigInt(fracMatch[2]));
    }

    // Decimal: "0.25", "-1.5", "0.1"
    const decMatch = s.match(/^([+-]?\d+)\.(\d+)$/);
    if (decMatch) {
      const sign = decMatch[1].startsWith('-') ? -1n : 1n;
      const intPart = Rational.absBigInt(BigInt(decMatch[1]));
      const fracPartStr = decMatch[2];
      const fracPart = BigInt(fracPartStr);
      const den = 10n ** BigInt(fracPartStr.length);
      const totalNum = sign * (intPart * den + fracPart);
      return new Rational(totalNum, den);
    }

    // Simple integer: "42", "-17"
    if (/^[+-]?\d+$/.test(s)) {
      return new Rational(BigInt(s), 1n);
    }

    throw new Error(`Noto‘g‘ri ratsional son formati: ${val}`);
  }

  public add(other: Rational | string | number): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  public sub(other: Rational | string | number): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  public mul(other: Rational | string | number): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.n, this.d * o.d);
  }

  public div(other: Rational | string | number): Rational {
    const o = Rational.from(other);
    if (o.n === 0n) throw new Error('Nolga bo‘lish mumkin emas (Division by zero)');
    return new Rational(this.n * o.d, this.d * o.n);
  }

  public pow(exponent: number): Rational {
    if (!Number.isInteger(exponent)) {
      throw new Error('Kasrli daraja Rational uchun qo‘llab-quvvatlanmaydi');
    }
    if (exponent === 0) return new Rational(1n, 1n);
    if (exponent < 0) {
      return new Rational(this.d ** BigInt(-exponent), this.n ** BigInt(-exponent));
    }
    return new Rational(this.n ** BigInt(exponent), this.d ** BigInt(exponent));
  }

  public abs(): Rational {
    return new Rational(Rational.absBigInt(this.n), this.d);
  }

  public equals(other: Rational | string | number): boolean {
    const o = Rational.from(other);
    return this.n === o.n && this.d === o.d;
  }

  public isZero(): boolean {
    return this.n === 0n;
  }

  public isNegative(): boolean {
    return this.n < 0n;
  }

  public isInteger(): boolean {
    return this.d === 1n;
  }

  public toNumber(): number {
    return Number(this.n) / Number(this.d);
  }

  /**
   * Returns exact decimal string if terminating, otherwise fraction
   */
  public toCleanString(): string {
    if (this.d === 1n) return this.n.toString();

    // Check if denominator's prime factors are only 2 and 5 (finite decimal)
    let tempD = this.d;
    while (tempD % 2n === 0n) tempD /= 2n;
    while (tempD % 5n === 0n) tempD /= 5n;

    if (tempD === 1n) {
      // It's a terminating decimal!
      const num = Number(this.n) / Number(this.d);
      return num.toString();
    }

    return `${this.n}/${this.d}`;
  }

  /**
   * Uzbek friendly representation: "3/4" or "1 1/2" or "5"
   */
  public toUzbekString(): string {
    if (this.d === 1n) return this.n.toString();

    // If improper fraction, show both mixed and simple fraction
    const absN = Rational.absBigInt(this.n);
    if (absN > this.d) {
      const whole = absN / this.d;
      const rem = absN % this.d;
      const sign = this.n < 0n ? '-' : '';
      if (rem === 0n) return `${sign}${whole}`;
      return `${this.n}/${this.d} (${sign}${whole} ${rem}/${this.d})`;
    }

    return `${this.n}/${this.d}`;
  }
}
