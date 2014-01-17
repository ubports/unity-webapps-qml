/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of unity-webapps-qml.
 *
 * unity-webapps-qml is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * unity-webapps-qml is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


#ifndef __UNITY_WEBAPPS_TOOLS_PRIV_H__
#define __UNITY_WEBAPPS_TOOLS_PRIV_H__

// T must be copy-constructible & have a default constructor
template <typename T>
class Fallible
{
public:
    struct InvalidValueException {};

public:
    Fallible()
        : _valid(false)
    {}
    Fallible(const T& value, bool valid = true)
        : _valid(valid), _value(value)
    {}
    bool isvalid() const { return _valid; }
    T value() const
    {
        if (!_valid)
            throw InvalidValueException();
        return _value;
    }

private:
    bool _valid;
    T _value;
};

#endif // __UNITY_WEBAPPS_TOOLS_PRIV_H__
