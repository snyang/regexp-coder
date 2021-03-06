import { RegExpCoder } from '../src/regExpCoder';
import { RegExpSpec } from '../src/regExpSpec';

export class MultiSubstitutePattern {
	/**
	 * Return an expression for replacing
	 * @param fromStrings the from strings
	 * @return an expression instance
	 */
	public static getRegExp(fromStrings: string[]): RegExp | null {
		if (!fromStrings) {
			return null;
		}

		const exp = new RegExpCoder()
			.or(...(fromStrings.map((value) => {
				const expValue = RegExpCoder.encodeRegExp(value);
				return expValue;
			})));

		return exp.toRegExp(RegExpSpec.dotIsNewLineFlag
			+ RegExpSpec.multipleLineSearchFlag
			+ RegExpSpec.globalSearchFlag);
	}

	/**
	 * Replace a string with multiple substitutes.
	 * @param value the replaced string.
	 * @param fromStings the from string array.
	 * @param toStrings the to string array.
	 * @return
	 */
	public static replace(value: string,
		fromStings: string[],
		toStrings: string[]): string {
		if (!fromStings) return value;
		if (!toStrings) return value;

		if (fromStings.length !== toStrings.length) {
			throw new Error('The count of fromStrings does not match with the count of toStrings.');
		}

		const exp = this.getRegExp(fromStings);
		const mapper = new Map<string, string>();
		fromStings.forEach((from, index) => {
			mapper.set(from, toStrings[index]);
		});

		let matcher = exp!.exec(value);
		let buffer = '';
		let lastIndex = 0;

		while (matcher !== null) {
			buffer += value.substring(lastIndex, matcher.index);
			const group = matcher[0];
			buffer += mapper.get(group);
			lastIndex = exp!.lastIndex;
			matcher = exp!.exec(value);
		}

		buffer += value.substring(lastIndex, value.length);
		return buffer;
	}
}
