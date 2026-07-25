import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoVerify, setAutoVerify] = useState(true);

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="App configuration & preferences" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSub}>Alerts for viral fake news</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#334155', true: colors.primaryGlow }}
              thumbColor={notifications ? colors.primary : '#94a3b8'}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Dark SaaS Theme</Text>
              <Text style={styles.settingSub}>Modern dark aesthetic</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#334155', true: colors.primaryGlow }}
              thumbColor={darkMode ? colors.primary : '#94a3b8'}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Auto-Verification</Text>
              <Text style={styles.settingSub}>Deep AI factual analysis</Text>
            </View>
            <Switch
              value={autoVerify}
              onValueChange={setAutoVerify}
              trackColor={{ false: '#334155', true: colors.primaryGlow }}
              thumbColor={autoVerify ? colors.primary : '#94a3b8'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoVal}>1.0.0 Native Android</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Engine</Text>
            <Text style={styles.infoVal}>Groq LLM 70B</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
