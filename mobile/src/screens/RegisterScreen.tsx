import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../theme/colors';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!username || !email || !password) return;
    await register(username, email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoHeader}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TruthGuard Fact Checking Community</Text>
        </View>

        <View style={styles.card}>
          <CustomInput
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={(t) => { clearError(); setUsername(t); }}
            autoCapitalize="none"
          />

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

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            variant="purple"
            loading={isLoading}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign In</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
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
