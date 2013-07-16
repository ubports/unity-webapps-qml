#!/bin/bash
#
# Copyright © 2013 Canonical Ltd.
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License version 3,
# as published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# Author: Juhapekka Piiroinen <juhapekka.piiroinen@canonical.com>
################################################################################

_CMD=""
_TARGET=$1
_TESTFILE=$2
_MAIN_MODULE_PATH=$3
_ARGS="-platform minimal"
set +e

function create_test_cmd {
  _CMD="./$_TARGET -input $_TESTFILE -import \"$_MAIN_MODULE_PATH\" -maxwarnings 20"
}

function execute_test_cmd {
  echo "Executing $_CMD $_ARGS"
  # segfault
  if [ $? -eq 139 ]; then
   return 2
  fi
  # abort
  if [ $? -eq 134 ]; then
   return 2
  fi
  return 0
}

create_test_cmd
execute_test_cmd
if [ $? -eq 2 ]; then
  echo "FAILURE: Failed to execute test with -platform minimal, lets try without"
  _ARGS=""
  execute_test_cmd
  if [ $? -eq 2 ]; then
   echo "FAILURE: Failed to execute test."
   set -e
   exit -2
  fi
fi

set -e
