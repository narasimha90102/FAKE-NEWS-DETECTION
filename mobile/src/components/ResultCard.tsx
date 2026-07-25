import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScoreRing } from './ScoreRing';
import { AgentProgressBar } from './AgentProgressBar';
import { VerificationResult } from '../store/useVerifyStore';
import { colors } from '../theme/colors';

interface ResultCardProps {
  result: VerificationResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const {
    score,
    verdict,
    summary,
    confidence = 'High',
    metrics = {
      sourceReliability: 85,
      contentAnalysis: 78,
      factVerification: 90,
      crossReference: 75,
    },
    checkedTime = '2 min ago',
    sourcesAnalyzed = 12,
    aiAgents = 4,
  } = result;

  let verdictLabel = 'Likely True';
  if (verdict === 'FAKE') verdictLabel = 'Fake / Unverified';
  else if (verdict === 'MISLEADING') verdictLabel = 'Misleading';
  else if (verdict === 'SATIRE') verdictLabel = 'Satire';

  return (
    <View style={styles.card}>
      {/* Top Header Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Complete</Text>
        <Text style={styles.subtitle}>Your Truth Score</Text>
      </View>

      <View style={styles.grid}>
        {/* Left Col: Score Ring & Summary Box */}
        <View style={styles.column}>
          <View style={styles.ringCard}>
            <ScoreRing score={score} verdictText={verdictLabel} />
            <Text style={styles.confidenceText}>
              Confidence: <Text style={{ color: colors.primary }}>{confidence}</Text>
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.boxTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
            <Text style={[styles.highlightText, { color: score > 50 ? colors.primary : colors.verdictFake }]}>
              {score > 50 ? 'No significant red flags detected.' : 'Warning: High disinformation indicators.'}
            </Text>
          </View>
        </View>

        {/* Right Col: AI Agent Analysis & Details */}
        <View style={styles.column}>
          <View style={styles.infoBox}>
            <Text style={styles.boxTitle}>AI Agent Analysis</Text>
            <AgentProgressBar label="Source Reliability" value={metrics.sourceReliability} />
            <AgentProgressBar label="Content Analysis" value={metrics.contentAnalysis} />
            <AgentProgressBar label="Fact Verification" value={metrics.factVerification} />
            <AgentProgressBar label="Cross Reference" value={metrics.crossReference} />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.boxTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Checked:</Text>
              <Text style={styles.detailVal}>{checkedTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sources Analyzed:</Text>
              <Text style={styles.detailVal}>{sourcesAnalyzed}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>AI Agents:</Text>
              <Text style={styles.detailVal}>{aiAgents}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    marginVertical: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'column',
    gap: 14,
  },
  column: {
    gap: 14,
  },
  ringCard: {
    backgroundColor: 'rgba(14,21,35,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(14,21,35,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailVal: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
