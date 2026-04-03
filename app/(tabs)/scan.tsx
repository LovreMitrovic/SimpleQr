import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScanning(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannedText(data);
    setScanning(false);
  };

  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setScanning(false)}
          accessibilityLabel="Close camera"
        >
          <FontAwesome name="times" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.resultContainer}>
        {scannedText.length > 0 ? (
          <TextInput
            style={[styles.resultInput, isDark && styles.resultInputDark]}
            value={scannedText}
            placeholder="Scanned content will appear here..."
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            multiline
            editable={false}
          />
        ) : (
          <Text style={[styles.hint, isDark && styles.hintDark]}>
            Press the button below to scan a QR code
          </Text>
        )}
      </View>
      <View style={[styles.buttonContainer, isDark && styles.buttonContainerDark]}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScan}
          accessibilityLabel="Scan QR code"
        >
          <FontAwesome name="camera" size={22} color="white" style={styles.buttonIcon} />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInput: {
    width: '100%',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
  },
  resultInputDark: {
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#222',
  },
  hint: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  hintDark: {
    color: '#aaa',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  buttonContainerDark: {
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
