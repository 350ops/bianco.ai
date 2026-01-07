import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import ThemedText from './ThemedText';

import useThemeColors from '@/app/contexts/ThemeColors';

interface WebView3DModelProps {
  modelUrl: string; // URL to the GLB model (must be a web URL, not local file)
  width?: number;
  height?: number;
  backgroundColor?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  showAR?: boolean;
  poster?: string; // Poster image URL while loading
}

/**
 * WebView-based 3D model viewer using Google's model-viewer
 * Supports pinch-to-zoom, rotate with one finger, and pan with two fingers
 *
 * Note: The model must be hosted at a web URL (not a local file)
 * You can use services like:
 * - GitHub raw files
 * - Cloudinary
 * - AWS S3
 * - Your own server
 */
const WebView3DModel: React.FC<WebView3DModelProps> = ({
  modelUrl,
  width = 300,
  height = 300,
  backgroundColor = 'transparent',
  autoRotate = true,
  cameraControls = true,
  showAR = false,
  poster,
}) => {
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the URL is a USDZ file (Apple's AR format)
  const isUsdz = modelUrl.toLowerCase().endsWith('.usdz');

  // Generate the HTML content with model-viewer
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: ${backgroundColor === 'transparent' ? 'transparent' : backgroundColor};
        }
        model-viewer {
          width: 100%;
          height: 100%;
          --poster-color: transparent;
        }
        model-viewer::part(default-progress-bar) {
          display: none;
        }
      </style>
    </head>
    <body>
      <model-viewer
        src="${modelUrl}"
        ${isUsdz ? `ios-src="${modelUrl}"` : ''}
        ${poster ? `poster="${poster}"` : ''}
        ${autoRotate ? 'auto-rotate' : ''}
        ${cameraControls ? 'camera-controls' : ''}
        ${showAR ? 'ar ar-modes="webxr scene-viewer quick-look"' : ''}
        touch-action="pan-y"
        interaction-prompt="none"
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        loading="eager"
      ></model-viewer>
      <script>
        const modelViewer = document.querySelector('model-viewer');
        let loadTimeout;
        
        // Set a timeout in case loading hangs
        loadTimeout = setTimeout(() => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'error', 
            message: 'Model loading timed out. The format may not be supported for web viewing.' 
          }));
        }, 15000);
        
        modelViewer.addEventListener('load', () => {
          clearTimeout(loadTimeout);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
        });
        
        modelViewer.addEventListener('error', (event) => {
          clearTimeout(loadTimeout);
          const message = event.detail?.message || event.message || 'Failed to load model';
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: message }));
        });
        
        // Also listen for model-visibility which fires when model is actually visible
        modelViewer.addEventListener('model-visibility', (event) => {
          if (event.detail.visible) {
            clearTimeout(loadTimeout);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
          }
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'loaded') {
        setIsLoading(false);
      } else if (data.type === 'error') {
        setError(data.message);
        setIsLoading(false);
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  if (error) {
    return (
      <View style={[styles.container, { width, height, backgroundColor: colors.bg }]}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        source={{ html: htmlContent }}
        style={[styles.webview, { width, height }]}
        scrollEnabled={false}
        bounces={false}
        onMessage={handleMessage}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        scalesPageToFit={false}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.highlight} />
          <ThemedText style={styles.loadingText}>Loading 3D Model...</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default WebView3DModel;
