/**
 * then steps
 */

module.exports = function (dict) {
    this
        .then(/^I expect that the title is( not)* "$string"$/,
            require('../support/check/checkTitle'))

        .then(/^I expect that element "$string" is( not)* visible$/,
            require('../support/check/isVisible'))

        .then(/^I expect that element "$string" does( not)* exist$/,
            require('../support/check/isExisting'))

        .then(/^I expect that element "$string" does( not)* contain the same text as element "$string"$/,
            require('../support/check/compareText'))

        .then(/^I expect that (element|inputfield) "$string"( not)* contains the text "([^"]*)"$/,
            require('../support/check/checkContent'))

        .then(/^I expect that the url is( not)* "$string"$/,
            require('../support/check/checkURL'))

        .then(/^I expect that the( css)* attribute "$string" from element "$string" is( not)* "$string"$/,
            require('../support/check/checkProperty'))

        .then(/^I expect that checkbox "$string" is( not)* selected$/,
            require('../support/check/checkSelected'))

        .then(/^I expect that cookie "$string"( not)* contains "$string"$/,
            require('../support/check/checkCookieContent'))

        .then(/^I expect that cookie "$string"( not)* exists$/,
            require('../support/check/checkCookieExists'))

        .then(/^I expect that element "$string" is( not)* ([\d]+)px (broad|tall)$/,
            require('../support/check/checkDimension'))

        .then(/^I expect that element "$string" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
            require('../support/check/checkOffset'))

        .then(/^I expect that element "$string" is( not)* within the viewport$/,
            require('../support/check/checkWithinViewport'))

        .then(/^I expect the url "$string" is opened in a new (tab|window)$/,
            require('../support/check/checkIsOpenedInNewWindow'));
};
