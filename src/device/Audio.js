/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Browser = require('./Browser');

/**
 * Determines the audio playback capabilities of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.audio` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Audio
 * @since 3.0.0
 *
 * @property {boolean} audioData - Can this device play HTML Audio tags?
 * @property {boolean} dolby - Can this device play EC-3 Dolby Digital Plus files?
 * @property {boolean} m4a - Can this device can play m4a files.
 * @property {boolean} aac - Can this device can play aac files.
 * @property {boolean} flac - Can this device can play flac files.
 * @property {boolean} mp3 - Can this device play mp3 files?
 * @property {boolean} ogg - Can this device play ogg files?
 * @property {boolean} opus - Can this device play opus files?
 * @property {boolean} wav - Can this device play wav files?
 * @property {boolean} webAudio - Does this device have the Web Audio API?
 * @property {boolean} webm - Can this device play webm files?
 */
var Audio = {

    flac: false,
    aac: false,
    audioData: false,
    dolby: false,
    m4a: false,
    mp3: false,
    ogg: false,
    opus: false,
    wav: false,
    webAudio: false,
    webm: false

};

function init ()
{
    if (typeof importScripts === 'function')
    {
        return Audio;
    }

    Audio.audioData = !!(window['Audio']);

    Audio.webAudio = !!(window['AudioContext'] || window['webkitAudioContext']);

    var audioElement = document.createElement('audio');
    var result = !!audioElement.canPlayType;

    try
    {
        if (result)
        {
            var CanPlay = function (type1, type2)
            {
                var canPlayType1 = audioElement.canPlayType('audio/' + type1).replace(/^no$/, '');

                if (type2)
                {
                    return Boolean(canPlayType1 || audioElement.canPlayType('audio/' + type2).replace(/^no$/, ''));
                }
                else
                {
                    return Boolean(canPlayType1);
                }
            };

            //  wav Mimetypes accepted:
            //  developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements

            Audio.ogg = CanPlay('ogg; codecs="vorbis"');
            Audio.opus = CanPlay('ogg; codecs="opus"', 'opus');
            Audio.mp3 = CanPlay('mpeg');
            Audio.wav = CanPlay('wav');
            Audio.m4a = CanPlay('x-m4a');
            Audio.aac = CanPlay('aac');
            Audio.flac = CanPlay('flac', 'x-flac');
            Audio.webm = CanPlay('webm; codecs="vorbis"');

            if (audioElement.canPlayType('audio/mp4; codecs="ec-3"') !== '')
            {
                if (Browser.edge)
                {
                    Audio.dolby = true;
                }
                else if (Browser.safari && Browser.safariVersion >= 9)
                {
                    if ((/Mac OS X (\d+)_(\d+)/).test(navigator.userAgent))
                    {
                        var major = parseInt(RegExp.$1, 10);
                        var minor = parseInt(RegExp.$2, 10);

                        if ((major === 10 && minor >= 11) || major > 10)
                        {
                            Audio.dolby = true;
                        }
                    }
                }
            }
        }
    }
    catch (e)
    {
        //  Nothing to do here
    }

    return Audio;
}

module.exports = init();
