/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Generates isomorphic tests for React components.
 */

// tslint:disable-next-line:no-var-requires
require("../../bootstrap");

import * as Enzyme from "enzyme";
import * as React from "react";

/**
 * Determines if the passed Component is a React Class or not
 * `TestUtils.isElement()`
 * @returns {boolean}
 */
function isReactClass(Component: any): boolean {
    return (
        typeof Component !== "undefined" &&
        typeof Component.prototype !== "undefined" &&
        typeof Component.prototype.constructor !== "undefined" &&
        typeof Component.prototype.render !== "undefined"
    );
}

/**
 * Tests that each ComponentClass in Components can be isomorphically rendered on the server.
 * @param Components  main export from package
 * @param props custom props per component
 * @param children custom children per component
 * @param skipList array of component names to skip
 */
export function generateIsomorphicTests(
    Components: { [name: string]: any },
    props: { [name: string]: any },
    children: { [name: string]: React.ReactNode },
    skipList: string[] = [],
) {
    Object.keys(Components)
        .sort()
        .forEach(componentName => {
            const Component = Components[componentName];
            if (isReactClass(Component)) {
                if (skipList.includes(componentName)) {
                    it.skip(`<${componentName}>`);
                } else {
                    it(`<${componentName}>`, () => {
                        const element = React.createElement(Component, props[componentName], children[componentName]);
                        // render to static HTML, just as a server would.
                        // we care merely that `render()` succeeds: it can be server-rendered.
                        // errors will fail the test and log full stack traces to the console. nifty!
                        Enzyme.render(element);
                    });
                }
            }
        });
}
