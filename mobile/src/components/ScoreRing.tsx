import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

interface ScoreRingProps {
  score: number;
  verdictText?: string;
  size?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  verdictText = 'Likely True',
  size = 140,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = colors.primary;
  if (score < 40) strokeColor = colors.verdictFake;
  else if (score < 70) strokeColor = colors.verdictMisleading;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.content}>
        <Text style={[styles.scoreNumber, { color: colors.textPrimary }]}>{score}</Text>
        <Text style={[styles.verdictText, { color: strokeColor }]}>{verdictText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
  },
  verdictText: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
});
