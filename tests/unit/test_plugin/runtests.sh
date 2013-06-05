#!/bin/bash
#
# Copyright 2013 Canonical Ltd.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation; version 3.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
################################################################################

set +e

_CMD=""
_TEST_FILE=$1

function create_test_cmd {
  _CMD="./$_TEST_FILE"
}

function execute_test_cmd {
  echo "Executing $_CMD"
  _FAILURES=$($_CMD | grep 'FAIL!' 2>&1)
  echo $_FAILURES
  if [ -z "$_FAILURES" ]
  then
    echo "OK."
  else
    echo "*** Failed tests."
    set -e
    exit -2
  fi
}

create_test_cmd
execute_test_cmd

