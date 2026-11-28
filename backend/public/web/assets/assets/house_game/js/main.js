/**
 * MathCity AI — 3D House Game Controller & Bridge
 * Clean ES communication between Flutter and Three.js Game Scene.
 */

(function () {
  // Global message dispatcher to Flutter (web parent window or Flutter JavascriptChannel)
  window.sendToFlutter = function (type, data) {
    const payload = { type, data: data || {} };
    // 1. Mobile WebView JavaScript Channel
    if (window.FlutterChannel && typeof window.FlutterChannel.postMessage === 'function') {
      try {
        window.FlutterChannel.postMessage(JSON.stringify(payload));
      } catch (e) {
        console.warn('FlutterChannel postMessage failed:', e);
      }
    }
    // 2. Web IFrame parent window postMessage
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(payload, '*');
      } catch (e) {
        console.warn('Parent postMessage failed:', e);
      }
    }
    // 3. Current window postMessage
    try {
      window.postMessage(payload, '*');
    } catch (e) {}
  };

  // Wait for DOM
  window.addEventListener('DOMContentLoaded', () => {
    // 1. Safe audio initialization (try-catch with NullSoundFx fallback)
    try {
      if (typeof window.HouseSoundFx === 'function') {
        window.soundFx = new window.HouseSoundFx();
      } else if (typeof window.SoundEffects === 'function') {
        window.soundFx = new window.SoundEffects();
      } else if (window.NullSoundFx) {
        window.soundFx = new window.NullSoundFx();
      }
    } catch (err) {
      console.warn('SoundFx initialization fallback:', err);
      if (window.NullSoundFx) {
        window.soundFx = new window.NullSoundFx();
      }
    }

    // 2. Initialize ItemBuilder & Scene
    try {
      if (typeof window.HouseItemBuilder === 'function') {
        window.itemBuilder = new window.HouseItemBuilder();
      }
      if (typeof window.HouseGameScene === 'function') {
        window.houseScene = new window.HouseGameScene('canvas-container');
      }
    } catch (err) {
      console.error('HouseGameScene initialization error:', err);
    }

    // 3. Wire HUD in-canvas buttons
    const btnResetCam = document.getElementById('btn-reset-cam');
    if (btnResetCam) {
      btnResetCam.addEventListener('click', () => {
        if (window.houseScene) {
          window.houseScene.resetCamera();
          window.sendToFlutter('CAMERA_RESET', {});
        }
      });
    }

    const btnRotate = document.getElementById('btn-rotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        if (window.houseScene) {
          window.houseScene.rotateCamera90();
          window.sendToFlutter('CAMERA_ROTATED_90', {});
        }
      });
    }

    // 4. Listen for commands from Flutter
    window.addEventListener('message', (event) => {
      try {
        let msg = event.data;
        if (typeof msg === 'string') {
          try {
            msg = JSON.parse(msg);
          } catch (_) {
            return;
          }
        }
        if (!msg || !msg.type) return;

        const type = msg.type;
        const data = msg.data || {};

        if (!window.houseScene) return;

        switch (type) {
          case 'LOAD_STATE':
            if (typeof data.stage === 'number') {
              window.houseScene.setBuildingStage(data.stage, false);
            }
            if (data.placedItems) {
              window.houseScene.loadPlacedItems(data.placedItems);
            }
            if (typeof data.isDark === 'boolean') {
              window.houseScene.setTheme(data.isDark);
            }
            break;

          case 'SET_STAGE':
            if (typeof data.stage === 'number') {
              window.houseScene.setBuildingStage(data.stage, data.animate !== false);
            }
            break;

          case 'ROTATE_90':
            window.houseScene.rotateCamera90();
            break;

          case 'ITEM_PLACED':
            if (data.item) {
              window.houseScene.addPlacedItemToScene(data.item, true);
              if (window.soundFx) window.soundFx.playBuildKnock();
            }
            break;

          case 'ITEM_REMOVED':
            if (data.instanceId) {
              window.houseScene.removeItemFromScene(data.instanceId);
              if (window.soundFx) window.soundFx.playCoinChime();
            }
            break;

          case 'SET_THEME':
            window.houseScene.setTheme(!!data.isDark);
            break;

          case 'SET_INTERIOR_MODE':
            window.houseScene.setInteriorMode(!!data.isInterior);
            break;

          case 'SELECT_ITEM_TO_PLACE':
            window.houseScene.selectItemToPlace(data.itemId, data.color);
            break;

          case 'ROTATE_GHOST':
            window.houseScene.rotatePlacementGhost();
            break;

          case 'CANCEL_PLACEMENT':
            window.houseScene.cancelPlacement();
            break;

          case 'RESET_CAMERA':
            window.houseScene.resetCamera();
            break;

          case 'SET_MUTE':
            if (window.soundFx) {
              window.soundFx.setMuted(!!data.muted);
            }
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('Error processing message from Flutter:', err);
      }
    });

    // Notify Flutter that the 3D scene is ready to receive state
    setTimeout(() => {
      window.sendToFlutter('SCENE_READY', { timestamp: Date.now() });
    }, 250);
  });
})();
