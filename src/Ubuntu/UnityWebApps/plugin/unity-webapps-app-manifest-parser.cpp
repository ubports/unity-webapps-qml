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
    if (!parseManifestContent(content, &infos))
    {
        qDebug() << "Could not open manifest file: " << manifest.absoluteFilePath();
        return ManifestFileInfoOption();
    }

    return ManifestFileInfoOption(infos);
}

bool UnityWebappsAppManifestParser::parseWebappDeclaration(const QJsonObject& json,
                                                           ManifestFileInfo * infos)
{
#define VALIDATE_PROPERTY_TYPE(property,predicate) \
    do { \
        if (  !json.contains(QLatin1String(property)) \
           || !json.value(QLatin1String(property)).predicate()) \
        { \
            qDebug() << "Invalid webapp manifest.json file:" << property << "not found or fails predicate" << #predicate; \
            return false; \
        } \
    } while(0)

    VALIDATE_PROPERTY_TYPE("name",isString);
    VALIDATE_PROPERTY_TYPE("domain",isString);
    VALIDATE_PROPERTY_TYPE("homepage",isString);
    VALIDATE_PROPERTY_TYPE("includes",isArray);
#undef VALIDATE_PROPERTY_TYPE

    infos->name = json.value(QLatin1String("name")).toString();
    infos->domain = json.value(QLatin1String("domain")).toString();
    infos->homepage = json.value(QLatin1String("homepage")).toString();
    infos->includes = parseArray(json, QLatin1String("includes"));

    // Script & requires (script source dependancies found in common/)
    // are not really mandatory, one could have a very simple webapp
    // that acts just as a launcher & w/ e.g. a ua override or speciic chrome
    if (json.contains("scripts")
            && json.value("scripts").isArray())
    {
        infos->scripts = parseArray(json, QLatin1String("scripts"));
    }

    if (json.contains("requires")
            && json.value("requires").isArray())
    {
        infos->requires = parseArray(json, QLatin1String("requires"));
    }

    QString chromeOption;
    if (json.contains("chrome") && json.value("chrome").isString())
    {
        chromeOption = json.value("chrome").toString();
    }
    infos->chromeOptions = parseChromeOptions(chromeOption);

    if (json.contains("user-agent-override")
            && json.value("user-agent-override").isString())
    {
        infos->userAgentOverride = json.value("user-agent-override").toString();
    }

    return true;
}

bool UnityWebappsAppManifestParser::parseManifestContent(const QString& content,
                                                        ManifestFileInfo * infos)
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

    QJsonObject object = doc.object();

    // In some instances we offer the option to
    // isolate the webapps definition in a specific
    // "namespace" (subobject) of a given manifest.json file.
    // It is handy in the context of click packages for which
    // some webapp definition elements are needed (UA string override)
    // and ideally defined in the same manifest.json file as the
    // click's manifest.json.

    if (object.contains("webapp-properties") &&
            object.value("webapp-properties").isObject())
    {
        object = object.value("webapp-properties").toObject();
    }

    return parseWebappDeclaration(object, infos);
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



