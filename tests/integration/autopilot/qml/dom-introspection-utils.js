/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * webbrowser-app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function gentid() {
    return Math.random() + '';
}

function wrapJsCommands(commands) {
    return '(function() { ' + commands + ' })();'
}

function createResult(result, tid) {
    return JSON.stringify({result: result, tid: tid});
}

function dumpValue(v) {
    if (typeof(v) === "string") {
       return "'" + v + "'";
    }
    return v;
}

function setupClosedVariables(variables) {
    var variableDeclStatements = '';
    for (var variable in variables) {
        if (variables.hasOwnProperty(variable)) {
            variableDeclStatements += 'var ' + variable + ' = ' + dumpValue(variables[variable]) + ';';
        }
    }
    return variableDeclStatements;
}


