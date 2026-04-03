import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions, scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
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

  const handleUpload = async () => {
    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library to upload a QR code image.');
        return;
      }
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (pickerResult.canceled || pickerResult.assets.length === 0) return;

    const uri = pickerResult.assets[0].uri;
    const results = await scanFromURLAsync(uri, ['qr']);

    if (results.length > 0) {
      setScannedText(results[0].data);
    } else {
      Alert.alert('No QR code found', 'Could not detect a QR code in the selected image.');
    }
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
            Press a button below to scan or upload a QR code
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
        <TouchableOpacity
          style={[styles.scanButton, styles.uploadButton]}
          onPress={handleUpload}
          accessibilityLabel="Upload QR code from photo library"
        >
          <FontAwesome name="image" size={22} color="white" style={styles.buttonIcon} />
          <Text style={styles.scanButtonText}>Upload from Library</Text>
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
    gap: 10,
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
  uploadButton: {
    backgroundColor: '#34C759',
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
