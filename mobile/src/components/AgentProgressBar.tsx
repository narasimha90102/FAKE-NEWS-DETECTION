import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface AgentProgressBarProps {
  label: string;
  value: number;
  max?: number;
}

export const AgentProgressBar: React.FC<AgentProgressBarProps> = ({
  label,
  value,
  max = 100,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let barColor = colors.primary;
  if (value < 40) barColor = colors.verdictFake;
  else if (value < 70) barColor = colors.verdictMisleading;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{value}/100</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
