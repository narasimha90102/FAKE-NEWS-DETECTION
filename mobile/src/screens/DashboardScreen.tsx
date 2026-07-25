import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="Analytics Dashboard" subtitle="Platform metrics & verification statistics" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stat Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>1,420</Text>
            <Text style={styles.statLabel}>Total Claims Checked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.primary }]}>94.2%</Text>
            <Text style={styles.statLabel}>AI Model Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.verdictFake }]}>612</Text>
            <Text style={styles.statLabel}>Fake News Flagged</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: colors.accent }]}>4</Text>
            <Text style={styles.statLabel}>Active AI Agents</Text>
          </View>
        </View>

        {/* System Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>AI Multi-Agent Pipeline Status</Text>
          
          <View style={styles.pipelineRow}>
            <Text style={styles.pipelineName}>1. Source Reliability Agent</Text>
            <Text style={styles.pipelineStatus}>● Active (Online)</Text>
          </View>
          <View style={styles.pipelineRow}>
            <Text style={styles.pipelineName}>2. Content Analysis Agent</Text>
            <Text style={styles.pipelineStatus}>● Active (Online)</Text>
          </View>
          <View style={styles.pipelineRow}>
            <Text style={styles.pipelineName}>3. Fact Verification Agent</Text>
            <Text style={styles.pipelineStatus}>● Active (Online)</Text>
          </View>
          <View style={styles.pipelineRow}>
            <Text style={styles.pipelineName}>4. Cross Reference Agent</Text>
            <Text style={styles.pipelineStatus}>● Active (Online)</Text>
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
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.cardBgSolid,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  statNum: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionCard: {
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
  pipelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  pipelineName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  pipelineStatus: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});
