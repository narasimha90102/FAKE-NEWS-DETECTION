import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ResultCard } from '../components/ResultCard';
import { useVerifyStore } from '../store/useVerifyStore';
import { colors } from '../theme/colors';

const SAMPLE_GENUINE = 'According to Reuters, the Reserve Bank of India held interest rates steady at its latest policy meeting.';
const SAMPLE_FAKE = 'Scientists confirm drinking hot water with lemon cures diabetes in 7 days — doctors hate this trick.';

export const VerifyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');

  const { currentResult, isLoading, analyzeClaim, clearCurrentResult } = useVerifyStore();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      Alert.alert('Required Input', 'Please enter news text or headline to analyze.');
      return;
    }
    await analyzeClaim(inputText.trim(), selectedLang);
  };

  const handleSample = (sampleText: string) => {
    setInputText(sampleText);
  };

  return (
    <View style={styles.container}>
      <Header title="News Verification Engine" subtitle="AI Fact Checking & Truth Score" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Input Card */}
        <View style={styles.inputCard}>
          {/* Engine Tabs */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, activeTab === 'text' && styles.tabActive]}
              onPress={() => setActiveTab('text')}
            >
              <Text style={[styles.tabText, activeTab === 'text' && styles.tabTextActive]}>
                Text Article
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'url' && styles.tabActive]}
              onPress={() => setActiveTab('url')}
            >
              <Text style={[styles.tabText, activeTab === 'url' && styles.tabTextActive]}>
                Article URL
              </Text>
            </Pressable>
          </View>

          {/* Sample Helper Buttons */}
          <View style={styles.sampleRow}>
            <Text style={styles.sampleLabel}>Try sample claim:</Text>
            <View style={styles.sampleBtns}>
              <Pressable style={styles.btnSample} onPress={() => handleSample(SAMPLE_GENUINE)}>
                <Text style={styles.btnSampleText}>+ Genuine Sample</Text>
              </Pressable>
              <Pressable style={styles.btnSample} onPress={() => handleSample(SAMPLE_FAKE)}>
                <Text style={styles.btnSampleText}>+ Fake Sample</Text>
              </Pressable>
            </View>
          </View>

          {/* Text Input */}
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            placeholder={
              activeTab === 'text'
                ? 'Paste news text, headlines, or claims to verify...'
                : 'Paste article URL (e.g., https://news-site.com/article/...)'
            }
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
          />

          {/* Action Row: Language & Analyze */}
          <View style={styles.actionRow}>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>🌐 {selectedLang}</Text>
            </View>

            <CustomButton
              title="⚡ Analyze"
              onPress={handleAnalyze}
              variant="purple"
              loading={isLoading}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Loading State */}
        {isLoading && <SkeletonLoader />}

        {/* Result Card */}
        {!isLoading && currentResult && (
          <View>
            <ResultCard result={currentResult} />
            <Pressable style={styles.clearBtn} onPress={clearCurrentResult}>
              <Text style={styles.clearBtnText}>Clear Result</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  inputCard: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tabActive: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sampleRow: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  },
  sampleLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sampleBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSample: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnSampleText: {
    fontSize: 11.5,
    color: colors.primary,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 110,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    padding: 14,
    color: colors.textPrimary,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langPill: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  langPillText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  clearBtn: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  clearBtnText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
