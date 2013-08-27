/*
 * Copyright 2013 Canonical Ltd.
 *
 * This file is part of UnityWebappsQML.
 *
 * UnityWebappsQML is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * UnityWebappsQML is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include <glib.h>
#include <gio/gdesktopappinfo.h>
#include <gio/gio.h>

#include <unity.h>
#include <glib-object.h>

#include <QString>
#include <QUrl>
#include <QStringList>
#include <QDebug>
#include <QByteArray>
#include <QMetaObject>

#include "unity-webapps-desktop-infos.h"
#include "unity-webapps-app-infos.h"

#include "unity-webapps-api-mediaplayer.h"


#define API_CALL_HEADER() do { \
        d->init(); \
        if (!d->_player) \
            return; \
    } while(0)


struct UnityWebappsMediaPlayerPrivate
{
    UnityWebappsMediaPlayerPrivate();
    ~UnityWebappsMediaPlayerPrivate();

    void clear();
    void init();

    UnityWebappsAppInfos *_appInfos;

    UnityMusicPlayer *_player;

    UnityTrackMetadata * _metadata;

    QObject* _raise_callback;
    QObject* _playpause_callback;
    QObject* _next_callback;
    QObject* _previous_callback;
};


static void
_uwq_media_callback_raised (UnityMusicPlayer *player, gpointer user_data)
{
    Q_UNUSED(player);

    UnityWebappsMediaPlayerPrivate* self =
            static_cast<UnityWebappsMediaPlayerPrivate*>(user_data);

    if (self->_raise_callback)
        QMetaObject::invokeMethod(self->_raise_callback, "trigger");
}

static void
_uwq_media_callback_play_pause (UnityMusicPlayer *player, gpointer user_data)
{
    Q_UNUSED(player);

    UnityWebappsMediaPlayerPrivate* self =
            static_cast<UnityWebappsMediaPlayerPrivate*>(user_data);

    if (self->_playpause_callback)
        QMetaObject::invokeMethod(self->_playpause_callback, "trigger");
}

static void
_uwq_media_callback_next (UnityMusicPlayer *player, gpointer user_data)
{
    Q_UNUSED(player);

    UnityWebappsMediaPlayerPrivate* self =
            static_cast<UnityWebappsMediaPlayerPrivate*>(user_data);

    if (self->_next_callback)
        QMetaObject::invokeMethod(self->_next_callback, "trigger");
}

static void
_uwq_media_callback_previous (UnityMusicPlayer *player, gpointer user_data)
{
    Q_UNUSED(player);

    UnityWebappsMediaPlayerPrivate* self =
            static_cast<UnityWebappsMediaPlayerPrivate*>(user_data);

    if (self->_previous_callback)
        QMetaObject::invokeMethod(self->_previous_callback, "trigger");
}

UnityWebappsMediaPlayerPrivate::UnityWebappsMediaPlayerPrivate()
    :_appInfos(0)
    , _player(0)
    , _metadata(0)
    , _raise_callback (0)
    , _playpause_callback (0)
    , _next_callback (0)
    , _previous_callback (0)
{}

UnityWebappsMediaPlayerPrivate::~UnityWebappsMediaPlayerPrivate()
{
    clear();
}

void UnityWebappsMediaPlayerPrivate::clear()
{
    if (_player && G_IS_OBJECT(_player))
    {
/*        g_signal_handlers_disconnect_by_func(_player,
                                             (gpointer)unity_webapps_messaging_menu_source_activated,
                                             this);
*/
        unity_music_player_set_is_blacklisted (_player, TRUE);

        g_object_unref(_player);

        _player = 0;
    }

    if (_metadata)
    {
        _metadata = 0;
        g_object_unref (_metadata);
    }

    _appInfos = 0;

    _raise_callback = 0;
    _playpause_callback = 0;
    _next_callback = 0;
    _previous_callback = 0;
}

void UnityWebappsMediaPlayerPrivate::init()
{
    if (Q_UNLIKELY(_player != NULL))
        return;

    if (Q_UNLIKELY(_appInfos == NULL))
    {
        qDebug() << "Trying to initialize the MediaPlayer binding with invalid context";
        return;
    }

    QString displayName = _appInfos->displayName();
    if (displayName.isEmpty())
    {
        qDebug() << "MediaPlayer backend: invalid display name (empty)";
        return;
    }

    QString desktopId = _appInfos->desktopId();
    if (desktopId.isEmpty())
    {
        qDebug() << "MediaPlayer backend: invalid desktop id (empty)";
        return;
    }

    _player = unity_music_player_new (desktopId.toUtf8().data());

    unity_music_player_set_title (_player, displayName.toUtf8().data());

    unity_music_player_set_is_blacklisted (_player, FALSE);

    g_signal_connect (_player,
                      "raise",
                      G_CALLBACK (_uwq_media_callback_raised), this);
    g_signal_connect (_player,
                      "play_pause",
                      G_CALLBACK (_uwq_media_callback_play_pause), this);
    g_signal_connect (_player,
                      "next",
                      G_CALLBACK (_uwq_media_callback_next), this);
    g_signal_connect (_player,
                      "previous",
                      G_CALLBACK (_uwq_media_callback_previous), this);
}



UnityWebappsMediaPlayer::UnityWebappsMediaPlayer(QObject *parent)
    : QObject(parent),
      d_ptr(new UnityWebappsMediaPlayerPrivate())
{}

UnityWebappsMediaPlayer::~UnityWebappsMediaPlayer()
{
    delete d_ptr;
}

void UnityWebappsMediaPlayer::onAppInfosChanged(UnityWebappsAppInfos *appInfos)
{
    Q_D(UnityWebappsMediaPlayer);

    bool wasInit = false;
    if (d->_player)
    {
        wasInit = true;
        d->clear();
    }
    d->_appInfos = appInfos;

    if (wasInit) d->init();
}

void UnityWebappsMediaPlayer::onPlayPause (UnityWebappsCallback * callback)
{
    Q_D(UnityWebappsMediaPlayer);

    API_CALL_HEADER();

    d->_playpause_callback = callback;
}

void UnityWebappsMediaPlayer::onPrevious (UnityWebappsCallback * callback)
{
    Q_D(UnityWebappsMediaPlayer);

    API_CALL_HEADER();

    d->_previous_callback = callback;
}

void UnityWebappsMediaPlayer::onNext (UnityWebappsCallback * callback)
{
    Q_D(UnityWebappsMediaPlayer);

    API_CALL_HEADER();

    d->_next_callback = callback;
}

void UnityWebappsMediaPlayer::setTrack (const QString & artist,
                           const QString & album,
                           const QString & title,
                           const QString & artLocation)
{
    Q_D(UnityWebappsMediaPlayer);

    API_CALL_HEADER();

    if (! d->_metadata)
        d->_metadata = unity_track_metadata_new ();

    unity_track_metadata_set_artist (d->_metadata, artist.toUtf8().data());
    unity_track_metadata_set_album (d->_metadata, album.toUtf8().data());
    unity_track_metadata_set_title (d->_metadata, title.toUtf8().data());

    if ( ! artLocation.isEmpty())
      {
        GFile * f = g_file_new_for_path (artLocation.toUtf8().data());
        unity_track_metadata_set_art_location (d->_metadata, f);
        g_object_unref (G_OBJECT (f));
      }

    unity_music_player_set_current_track (d->_player, d->_metadata);
}

void UnityWebappsMediaPlayer::setCanGoNext (bool state)
{
    Q_D(UnityWebappsMediaPlayer);
    API_CALL_HEADER();

    unity_music_player_set_can_go_next(d->_player, state);
}

void UnityWebappsMediaPlayer::setCanGoPrevious (bool state)
{
    Q_D(UnityWebappsMediaPlayer);
    API_CALL_HEADER();

    unity_music_player_set_can_go_previous(d->_player, state);
}

void UnityWebappsMediaPlayer::setCanPlay (bool state)
{
    Q_D(UnityWebappsMediaPlayer);
    API_CALL_HEADER();

    unity_music_player_set_can_play(d->_player, state);
}

void UnityWebappsMediaPlayer::setCanPause (bool state)
{
    Q_D(UnityWebappsMediaPlayer);
    API_CALL_HEADER();

    unity_music_player_set_can_pause(d->_player, state);
}

void UnityWebappsMediaPlayer::setPlaybackState(PlaybackState state)
{
    Q_D(UnityWebappsMediaPlayer);
    API_CALL_HEADER();

    unity_music_player_set_playback_state(d->_player, (UnityPlaybackState) state);
}

UnityWebappsMediaPlayer::PlaybackState
UnityWebappsMediaPlayer::getPlaybackState ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return PLAYING;
    return (PlaybackState) unity_music_player_get_playback_state(d->_player);
}

QString UnityWebappsMediaPlayer::getTrack ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return QString();

    UnityTrackMetadata * metadata =
            unity_music_player_get_current_track(d->_player);

    QString artist = unity_track_metadata_get_artist (metadata);
    QString title = unity_track_metadata_get_title (metadata);
    QString album = unity_track_metadata_get_album (metadata);

    QString track = QString("%1;%2;%3").arg(artist.toUtf8().toBase64().data())
                              .arg(title.toUtf8().toBase64().data())
                              .arg(album.toUtf8().toBase64().data());
    qDebug() << "get track " << track;
    return track;
}

bool UnityWebappsMediaPlayer::getCanGoNext ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return false;
    return unity_music_player_get_can_go_next(d->_player);
}

bool UnityWebappsMediaPlayer::getCanGoPrevious ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return false;
    return unity_music_player_get_can_go_previous(d->_player);
}

bool UnityWebappsMediaPlayer::getCanPlay ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return false;
    return unity_music_player_get_can_play(d->_player);
}

bool UnityWebappsMediaPlayer::getCanPause ()
{
    Q_D(UnityWebappsMediaPlayer);

    d->init();
    if (!d->_player)
        return false;
    return unity_music_player_get_can_pause(d->_player);
}

void UnityWebappsMediaPlayer::classBegin()
{
}

void UnityWebappsMediaPlayer::componentComplete()
{
}


