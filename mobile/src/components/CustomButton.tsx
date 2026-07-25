import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'purple';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  let btnBg = colors.primary;
  let textColor = '#090d16';

  if (variant === 'secondary') {
    btnBg = colors.cardBgSolid;
    textColor = colors.textPrimary;
  } else if (variant === 'ghost') {
    btnBg = 'transparent';
    textColor = colors.textSecondary;
  } else if (variant === 'purple') {
    btnBg = colors.secondary;
    textColor = '#ffffff';
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: colors.primaryRipple }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: btnBg, opacity: pressed || disabled ? 0.8 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
});
