/**
 * MathCity AI — 3D House Game Controller & Bridge
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
    // 1. Initialize audio, item builder, and scene
    window.soundFx = new window.HouseSoundFx();
    window.itemBuilder = new window.HouseItemBuilder();
    window.houseScene = new window.HouseGameScene('canvas-container');

    // 2. Wire HUD buttons
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
          window.houseScene.rotatePlacementGhost();
          window.sendToFlutter('GHOST_ROTATED', { rotation: window.houseScene.currentRotation });
        }
      });
    }

    // 3. Listen for commands from Flutter
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

        switch (type) {
          case 'LOAD_STATE':
            if (data.placedItems) {
              window.houseScene.loadPlacedItems(data.placedItems);
            }
            if (typeof data.isDark === 'boolean') {
              window.houseScene.setTheme(data.isDark);
            }
            break;

          case 'ITEM_PLACED':
            if (data.item) {
              window.houseScene.addPlacedItemToScene(data.item, true);
              window.soundFx.playBuildKnock();
            }
            break;

          case 'ITEM_REMOVED':
            if (data.instanceId) {
              window.houseScene.removeItemFromScene(data.instanceId);
              window.soundFx.playCoinChime();
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
            window.soundFx.setMuted(!!data.muted);
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
