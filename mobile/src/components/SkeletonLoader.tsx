import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { colors } from '../theme/colors';

export const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>TruthCheck AI Agents Analyzing Claim...</Text>
      <View style={styles.barGroup}>
        <View style={styles.skeletonBar} />
        <View style={[styles.skeletonBar, { width: '70%' }]} />
        <View style={[styles.skeletonBar, { width: '85%' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  text: {
    fontSize: 13.5,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 20,
  },
  barGroup: {
    width: '100%',
    gap: 10,
  },
  skeletonBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    width: '100%',
  },
});
