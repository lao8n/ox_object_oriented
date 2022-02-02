import * as util from 'util';

/**
 * Type of the 'inspect' parameter in type {@link CustomInspectParams}.
 */
type InspectType = (object: unknown, options?: util.InspectOptions) => string

/**
 * Type of parameters for the class methods/object property used to customise Node.js's 'util.inspect' output,
 * used in particular by 'console.log'.
 * 
 * @see {@link CustomInspectSymbol}
 */
export type CustomInspectParams = readonly [number, util.InspectOptionsStylized, InspectType];

/**
 * Symbol used to name the class methods/object property used to customise Node.js's 'util.inspect' output,
 * used in particular by 'console.log'.
 * 
 * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
 * 
 * @example
 * 
 * class MyClass {
 *     [CustomInspectSymbol](...customInspectParams: CustomInspectParams): string {
 *         // custom string output by console.log
 *     }
 * }
 */
export const CustomInspectSymbol = util.inspect.custom;

/**
 * Function for custom Node.js logging of class instances.
 * 
 * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
 */
export function logObject(typeName: string, members: Record<string, unknown>, ...[depth, options, inspect]: CustomInspectParams): string {
    const innerOptions = Object.assign({}, options, {
        depth: typeof options.depth == "number" ? options.depth-1 : undefined
    });
    const memberStrings: string[] = [];
    for (const memberName in members){
        const memberValue = members[memberName];
        const memberString = inspect(memberValue, innerOptions).replaceAll('\n', '\n  ');
        memberStrings.push(`${memberName}: ${memberString}`);
    }
    if (depth < 0){
        return options.stylize(`[${typeName}]`, "special");
    }
    const inspectStr =
`${typeName} {
  ${memberStrings.join(",\n  ")}
}`;
    return inspectStr;
}

/**
 * A test class exemplifying how to use {@link logObject} for custom Node.js logging.
 * 
 * @example
 * 
 * console.log(new TestClass());
 * 
 * // Output:
 * 
 * Bot {
 *   name: 'WALL-E',
 *   color: 'yellow',
 *   kind: 'robot',
 *   job: 'trash compactor'
 * }
 */
class TestClass {
    /**
     * Custom representation for Node.js logging.
     * 
     * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
     */
    [CustomInspectSymbol](...customInspectParams: CustomInspectParams) {
        const typeName = "Bot";
        const members = {
            name: "WALL-E",
            color: "yellow",
            kind: "robot",
            job: "trash compactor"
        };
        return logObject(typeName, members, ...customInspectParams);
    }
}
