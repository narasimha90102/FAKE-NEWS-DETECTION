import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      // Auto redirects via AppNavigator state
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo / Header */}
        <View style={styles.logoHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🛡️</Text>
          </View>
          <Text style={styles.title}>TruthCheck</Text>
          <Text style={styles.subtitle}>AI Fact Verification Platform</Text>
        </View>

        {/* Login Card (Fits viewport without scrolling) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          <CustomInput
            label="Email Address"
            placeholder="name@company.com"
            value={email}
            onChangeText={(t) => { clearError(); setEmail(t); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => { clearError(); setPassword(t); }}
            secureTextEntry
          />

          {error && <Text style={styles.errorBanner}>{error}</Text>}

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            variant="purple"
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  logoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,229,160,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 12.5,
    color: colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    marginBottom: 14,
  },
  errorBanner: {
    fontSize: 12,
    color: colors.verdictFake,
    marginBottom: 10,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
});
