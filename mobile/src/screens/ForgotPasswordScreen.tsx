import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';

export const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
    Alert.alert('Reset Link Sent', 'Password reset instructions have been sent to your email.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email address to receive reset instructions</Text>

        <View style={styles.card}>
          <CustomInput
            label="Email Address"
            placeholder="name@company.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomButton
            title={submitted ? 'Resend Reset Link' : 'Send Reset Link'}
            onPress={handleSubmit}
            variant="purple"
            style={styles.submitBtn}
          />

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back to Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
  },
  submitBtn: {
    marginTop: 10,
    marginBottom: 14,
  },
  backBtn: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  backText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
