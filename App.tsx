import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import YtDlp from 'ytdlp-react-native';

export default function App() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720');
  const [mode, setMode] = useState<'video' | 'audio'>('video');
  const [status, setStatus] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const startDownload = async () => {
    if (!url) {
      Alert.alert('Missing URL', 'Please paste a video URL first.');
      return;
    }

    setBusy(true);
    setStatus('Starting...');

    try {
      const format =
        mode === 'audio'
          ? 'bestaudio'
          : `best[height<=${quality}]`;

      const task = await YtDlp.download({
        url,
        format,
        output: { directory: 'Movies' },
      });

      task.addListener('progress', (p: any) => {
        const percent = p.percent ? p.percent.toFixed(1) : '0';
        const speed = p.speedBytesPerSecond
          ? ` • ${(p.speedBytesPerSecond / 1024 / 1024).toFixed(2)} MB/s`
          : '';
        setStatus(`Downloading ${percent}%${speed}`);
      });

      task.addListener('completed', (result: any) => {
        setStatus('Completed');
        setBusy(false);
        Alert.alert('Download complete', `Saved to:\n${result.path}`);
        setUrl('');
      });

      task.addListener('error', (err: any) => {
        setStatus(`Error: ${err.message}`);
        setBusy(false);
        Alert.alert('Download failed', err.message);
      });
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      setBusy(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Rainax Downloader</Text>
          <Text style={styles.subtitle}>Paste a link to begin</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Video URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor="#666"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!busy}
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segBtn, mode === 'video' && styles.segBtnActive]}
              onPress={() => setMode('video')}
              disabled={busy}
            >
              <Text style={[styles.segText, mode === 'video' && styles.segTextActive]}>
                Video
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segBtn, mode === 'audio' && styles.segBtnActive]}
              onPress={() => setMode('audio')}
              disabled={busy}
            >
              <Text style={[styles.segText, mode === 'audio' && styles.segTextActive]}>
                Audio
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'video' && (
            <>
              <Text style={styles.label}>Quality</Text>
              <View style={styles.segment}>
                {['360', '480', '720'].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[styles.segBtn, quality === q && styles.segBtnActive]}
                    onPress={() => setQuality(q)}
                    disabled={busy}
                  >
                    <Text
                      style={[
                        styles.segText,
                        quality === q && styles.segTextActive,
                      ]}
                    >
                      {q}p
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={startDownload}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Download</Text>
            )}
          </TouchableOpacity>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Files are saved to your Movies folder
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0c11',
  },
  scroll: {
    padding: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  card: {
    backgroundColor: '#141821',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232833',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9aa4b2',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0f1218',
    borderWidth: 1,
    borderColor: '#2a2f3a',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 15,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#0f1218',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segBtnActive: {
    backgroundColor: '#4f8bff',
  },
  segText: {
    color: '#9aa4b2',
    fontSize: 14,
    fontWeight: '500',
  },
  segTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#4f8bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#0f1218',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9aa4b2',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});
