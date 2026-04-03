import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  useColorScheme,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function MakeScreen() {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePaste = async () => {
    const clipboardText = await Clipboard.getStringAsync();
    if (clipboardText) {
      setText(clipboardText);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.qrContainer}>
        {text.length > 0 ? (
          <QRCode
            value={text}
            size={250}
            backgroundColor={isDark ? '#000' : '#fff'}
            color={isDark ? '#fff' : '#000'}
          />
        ) : (
          <Text style={[styles.placeholder, isDark && styles.placeholderDark]}>
            Enter text below to generate a QR code
          </Text>
        )}
      </View>
      <View style={[styles.inputRow, isDark && styles.inputRowDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={text}
          onChangeText={setText}
          placeholder="Enter text..."
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          multiline
        />
        <TouchableOpacity
          style={[styles.pasteButton, isDark && styles.pasteButtonDark]}
          onPress={handlePaste}
          accessibilityLabel="Paste from clipboard"
        >
          <Text style={styles.pasteButtonText}>Paste</Text>
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
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  placeholderDark: {
    color: '#aaa',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputRowDark: {
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  inputDark: {
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#222',
  },
  pasteButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasteButtonDark: {
    backgroundColor: '#0A84FF',
  },
  pasteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
