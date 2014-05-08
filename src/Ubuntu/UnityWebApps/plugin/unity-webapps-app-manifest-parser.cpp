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

#include <QTextStream>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonValue>
#include <QDebug>

#include "unity-webapps-app-manifest-parser.h"


UnityWebappsAppManifestParser::UnityWebappsAppManifestParser(QObject *parent)
    :QObject(parent)
{}

UnityWebappsAppManifestParser::~UnityWebappsAppManifestParser()
{}

ManifestFileInfoOption UnityWebappsAppManifestParser::parse (QFileInfo manifest)
{
    if (!manifest.isFile())
    {
        qDebug() << "Invalid webapps path found: " << manifest.absoluteFilePath();
        return ManifestFileInfoOption();
    }

    QFile f(manifest.absoluteFilePath());
    if (!f.open(QIODevice::ReadOnly | QIODevice::Text))
    {
        qDebug() << "Could not open manifest file: " << manifest.absoluteFilePath();
        return ManifestFileInfoOption();
    }

    QTextStream istream(&f);
    istream.setCodec("UTF-8");
    QString content = istream.readAll();

    ManifestFileInfo infos;
    if (!parseContent(content, &infos))
    {
        qDebug() << "Could not open manifest file: " << manifest.absoluteFilePath();
        return ManifestFileInfoOption();
    }

    return ManifestFileInfoOption(infos);
}

bool UnityWebappsAppManifestParser::parseContent(const QString& content, ManifestFileInfo * infos)
{
    if (! infos)
        return false;

    QJsonParseError error;
    QJsonDocument doc(QJsonDocument::fromJson(content.toStdString().c_str(), &error));

    if (error.error != QJsonParseError::NoError)
    {
        qDebug() << "Could not parse json from manifest: " << error.errorString();
        return false;
    }

    if (!doc.isObject())
        return false;

#define VALIDATE_PROPERTY_TYPE(property,predicate) \
    !object.contains(QLatin1String(property)) \
    || !object.value(QLatin1String(property)).predicate()

    QJsonObject object = doc.object();
    if (VALIDATE_PROPERTY_TYPE("name",isString)
          || VALIDATE_PROPERTY_TYPE("domain",isString)
          || VALIDATE_PROPERTY_TYPE("homepage",isString)
          || VALIDATE_PROPERTY_TYPE("includes",isArray)
          || VALIDATE_PROPERTY_TYPE("requires",isArray)
          || VALIDATE_PROPERTY_TYPE("scripts",isArray)
        )
    {
        return false;
    }
#undef VALIDATE_PROPERTY_TYPE

    infos->domain = object.value(QLatin1String("domain")).toString();
    infos->name = object.value(QLatin1String("name")).toString();
    infos->homepage = object.value(QLatin1String("homepage")).toString();

    infos->scripts = parseArray(object, QLatin1String("scripts"));
    infos->requires = parseArray(object, QLatin1String("requires"));
    infos->includes = parseArray(object, QLatin1String("includes"));

    QString chromeOption;
    if (object.contains("chrome") && object.value("chrome").isString())
    {
        chromeOption = object.value("chrome").toString();
    }
    infos->chromeOptions = parseChromeOptions(chromeOption);

    QString userAgentOverride;
    if (object.contains("user-agent-override")
            && object.value("user-agent-override").isString())
    {
        infos->userAgentOverride = object.value("user-agent-override").toString();
    }

    return true;
}

QStringList
UnityWebappsAppManifestParser::parseChromeOptions(const QString& options)
{
    static const QStringList DEFAULT_OPTIONS("no-chrome");

    if (options.isNull() || options.isEmpty())
        return DEFAULT_OPTIONS;

    static const QStringList VALID_CHROME_OPTIONS =
            (QStringList() << "no-chrome" << "back-forward-buttons" << "reload-button");

    QStringList result;

    // strip unvalid options
    QStringList splittedOptions = options.split(";");
    Q_FOREACH(QString option, splittedOptions)
    {
        if (VALID_CHROME_OPTIONS.contains(option.trimmed()))
        {
            result.append(option.trimmed());
        }
    }

    // no-chrome has precedence
    if (result.contains("no-chrome"))
    {
        result.clear();
        result.append("no-chrome");
    }

    if (result.isEmpty())
    {
        qDebug() << "Chrome display selection defaulting to no-chrome since no option was found";
        result.append("no-chrome");
    }

    return result;
}

QStringList UnityWebappsAppManifestParser::parseArray(const QJsonObject& parent
                                                      , const QString& name)
{
    QJsonValue value = parent.value(name);
    if (!value.isArray())
    {
        //TODO shoudl be meaner than that
        qDebug() << "Was expecting an array for name " << name;
        return QStringList();
    }

    QJsonArray array = value.toArray();
    QStringList parsedArray;
    Q_FOREACH(QVariant v, array.toVariantList())
    {
        if (!v.canConvert(QVariant::String))
            continue;
        parsedArray.append(v.toString());
    }
    return parsedArray;
}



